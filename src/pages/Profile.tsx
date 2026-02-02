import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, auth } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    whatsapp_number: "",
    address: "",
    state: "",
    city: ""
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch profile data
      try {
        const profileData = await api.getProfile();
        if (profileData) {
          setProfile({
            full_name: profileData.full_name,
            email: profileData.email,
            phone_number: profileData.phone_number,
            whatsapp_number: profileData.whatsapp_number || "",
            address: profileData.address,
            state: profileData.state,
            city: profileData.city
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load profile data",
          variant: "destructive"
        });
      }

      // Check if user is an affiliate
      try {
        const { isAffiliate: isAff } = await api.checkAffiliate();
        setIsAffiliate(isAff);
      } catch (error) {
        setIsAffiliate(false);
      }

      setLoading(false);
    };

    checkUser();
  }, [navigate, toast]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setUpdating(true);
    try {
      await api.changePassword(passwordData.oldPassword, passwordData.newPassword);
      toast({
        title: "Success!",
        description: "Password updated successfully",
      });
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">My Profile</h1>

        {isAffiliate && (
          <div className="mb-6 text-center">
            <Button onClick={() => navigate('/affiliate-dashboard')} size="lg" variant="outline">
              View Affiliate Dashboard
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input value={profile.full_name} disabled />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={profile.email} disabled />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={profile.phone_number} disabled />
              </div>
              <div>
                <Label>WhatsApp Number</Label>
                <Input value={profile.whatsapp_number || profile.phone_number} disabled />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={profile.address} disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>State</Label>
                  <Input value={profile.state} disabled />
                </div>
                <div>
                  <Label>City</Label>
                  <Input value={profile.city} disabled />
                </div>
              </div>
            </div>
          </Card>

          {/* Change Password */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={updating}>
                {updating ? "Updating..." : "Change Password"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
