import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Save } from "lucide-react";
import { nigeriaStates } from "@/data/nigeriaLocations";

type Row = {
  id?: string;
  location_type: "state" | "city";
  name: string;
  parent_state: string | null;
  price: number;
};

const lagosCities = nigeriaStates.find((s) => s.state === "Lagos")!.cities;

function locationKey(location_type: string, name: string, parent_state: string | null) {
  return `${location_type}::${name}::${parent_state ?? ""}`;
}

export default function Pricing() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [customCities, setCustomCities] = useState<string[]>([]);
  const [newCity, setNewCity] = useState("");

  const allCities = [...lagosCities, ...customCities];

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("delivery_pricing")
        .select("location_type, name, parent_state, price");

      if (data) {
        const map: Record<string, number> = {};
        const extras: string[] = [];
        data.forEach((row: any) => {
          if (
            row.location_type === "city" &&
            row.parent_state === "Lagos" &&
            !lagosCities.includes(row.name) &&
            !extras.includes(row.name)
          ) {
            extras.push(row.name);
          }
          map[locationKey(row.location_type, row.name, row.parent_state)] = row.price;
        });
        extras.sort((a, b) => a.localeCompare(b));
        setCustomCities(extras);
        setPrices(map);
      }
      setLoading(false);
    })();
  }, []);

  const setPrice = (location_type: string, name: string, parent_state: string | null, value: string) => {
    const num = parseFloat(value);
    setPrices((prev) => ({
      ...prev,
      [locationKey(location_type, name, parent_state)]: isNaN(num) ? 0 : num,
    }));
  };

  const getPrice = (location_type: string, name: string, parent_state: string | null) => {
    return prices[locationKey(location_type, name, parent_state)] ?? 0;
  };

  const handleAddCity = () => {
    const name = newCity.trim();
    if (!name) {
      toast({ title: "City name required", variant: "destructive" });
      return;
    }
    if (allCities.some((c) => c.toLowerCase() === name.toLowerCase())) {
      toast({ title: "City already exists", variant: "destructive" });
      return;
    }
    setCustomCities((prev) => [...prev, name]);
    setPrices((prev) => ({ ...prev, [locationKey("city", name, "Lagos")]: 0 }));
    setNewCity("");
    toast({ title: "City added", description: "Set a delivery fee and save to update it." });
  };

  const handleSave = async () => {
    setSaving(true);

    const rows: Row[] = [
      ...nigeriaStates.map((s) => ({
        location_type: "state" as const,
        name: s.state,
        parent_state: null as null,
        price: getPrice("state", s.state, null),
      })),
      ...allCities.map((c) => ({
        location_type: "city" as const,
        name: c,
        parent_state: "Lagos",
        price: getPrice("city", c, "Lagos"),
      })),
    ];

    const { error } = await supabase
      .from("delivery_pricing")
      .upsert(rows, { onConflict: "location_type,name,parent_state" });

    setSaving(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "All prices have been updated." });
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-6 md:px-16 bg-background min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  const renderRows = (items: { label: string; location_type: string; parent_state: string | null }[]) => (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={locationKey(item.location_type, item.label, item.parent_state)} className="flex items-center gap-4">
          <Label className="w-56 shrink-0 text-sm text-foreground">{item.label}</Label>
          <Input
            type="number"
            min={0}
            step={0.01}
            className="max-w-[140px]"
            value={getPrice(item.location_type, item.label, item.parent_state)}
            onChange={(e) => setPrice(item.location_type, item.label, item.parent_state, e.target.value)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-16 px-6 md:px-16 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-foreground mb-2">
          Delivery Pricing
        </h1>
        <p className="text-center text-muted-foreground mb-10">
          Set delivery fees for each Nigerian state and each Lagos city.
        </p>

        <Tabs defaultValue="states">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="states">States ({nigeriaStates.length})</TabsTrigger>
            <TabsTrigger value="lagos">Lagos Cities ({allCities.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="states">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Nigerian States</CardTitle>
              </CardHeader>
              <CardContent>
                {renderRows(
                  nigeriaStates.map((s) => ({
                    label: s.state,
                    location_type: "state",
                    parent_state: null,
                  }))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lagos">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Lagos Local Government Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 mb-6">
                  <Input
                    type="text"
                    placeholder="Add a new city (e.g. Agege)"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCity();
                      }
                    }}
                    className="max-w-xs"
                  />
                  <Button type="button" onClick={handleAddCity} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add City
                  </Button>
                </div>
                {allCities.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No cities added yet.</p>
                ) : (
                  renderRows(
                    allCities.map((c) => ({
                      label: c,
                      location_type: "city",
                      parent_state: "Lagos",
                    }))
                  )
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2 px-8">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save All Prices"}
          </Button>
        </div>
      </div>
    </section>
  );
}