
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const AccountPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bids, setBids] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: user?.email || "",
    company: "",
  });

  // Fetch user's bid history
  useEffect(() => {
    const fetchBids = async () => {
      try {
        if (!user) return;
        
        console.log("Fetching bids for user:", user.id);
        const { data, error } = await supabase
          .from("bids")
          .select(`
            id, 
            brand_name, 
            bid_amount, 
            status, 
            created_at, 
            admin_response,
            events (
              id,
              title, 
              date
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Bid fetch error:", error);
          throw error;
        }
        
        console.log("Fetched bids:", data);
        setBids(data || []);
      } catch (error: any) {
        console.error("Error fetching bids:", error);
        toast.error("Failed to load your bid history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBids();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30";
      case "pending":
      default:
        return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30";
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Your Account</h1>
          
          <Tabs defaultValue="bids" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bids">Bid History</TabsTrigger>
              <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bids" className="space-y-6">
              <Card className="bg-card/40 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle>Your Sponsorship Bids</CardTitle>
                  <CardDescription>View and manage your event sponsorship bids</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">Loading your bid history...</div>
                  ) : bids.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">You haven't submitted any bids yet</p>
                      <Button onClick={() => navigate("/events")}>Discover Events</Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableCaption>All your submitted sponsorship bids</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Bid Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Response</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bids.map((bid) => (
                            <TableRow key={bid.id}>
                              <TableCell className="font-medium">
                                <Button variant="link" className="p-0 h-auto" onClick={() => navigate(`/events/${bid.events?.id}`)}>
                                  {bid.events?.title || "Unknown Event"}
                                </Button>
                              </TableCell>
                              <TableCell>{formatDate(bid.created_at)}</TableCell>
                              <TableCell>AED {Number(bid.bid_amount).toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge className={getStatusBadgeStyle(bid.status)}>
                                  {bid.status ? bid.status.charAt(0).toUpperCase() + bid.status.slice(1) : "Pending"}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-xs truncate">
                                {bid.admin_response || "No response yet"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-card/40 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle>Payment Status</CardTitle>
                  <CardDescription>Manage payment for approved sponsorships</CardDescription>
                </CardHeader>
                <CardContent>
                  {bids.filter(b => b.status === "approved").length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">You don't have any approved sponsorships yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Sponsorship Amount</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bids
                            .filter(bid => bid.status === "approved")
                            .map((bid) => (
                              <TableRow key={bid.id}>
                                <TableCell className="font-medium">{bid.events?.title || "Unknown Event"}</TableCell>
                                <TableCell>AED {Number(bid.bid_amount).toLocaleString()}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">Pending</Badge>
                                </TableCell>
                                <TableCell>
                                  <Button size="sm">Pay Now</Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card className="bg-card/40 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input 
                          id="company"
                          value={profileData.company}
                          onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                          placeholder="Your company name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled
                      />
                      <p className="text-sm text-muted-foreground">Your email address can't be changed</p>
                    </div>
                    
                    <Separator className="my-8" />
                    
                    <div className="flex justify-end">
                      <Button type="submit">Update Profile</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;
