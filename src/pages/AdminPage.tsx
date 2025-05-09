
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BarChart, Tag, Users, Calendar, Edit, Trash2, Plus, Search, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample Data
import { sponsorshipTypes, brandInquiries, eventOrganizers } from "../data/adminData";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [packages, setPackages] = useState(sponsorshipTypes);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    if (editingPackage) {
      // Update existing package
      setPackages(packages.map(pkg => 
        pkg.id === editingPackage.id ? { ...pkg, ...data } : pkg
      ));
      toast.success("Package updated successfully!");
    } else {
      // Add new package
      setPackages([...packages, { 
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        price: data.price,
        features: data.features.split(',').map((f: string) => f.trim()),
        active: true
      }]);
      toast.success("New package added successfully!");
    }
    setEditingPackage(null);
    reset();
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    reset({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      features: pkg.features.join(', ')
    });
  };

  const handleDelete = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
    toast.success("Package deleted successfully!");
  };

  const filterInquiries = (items: any[]) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-background border-r p-4 h-screen">
          <div className="flex items-center mb-8">
            <span className="text-xl font-semibold">sponsorby</span>
            <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Admin</span>
          </div>
          
          <div className="space-y-1">
            <Button 
              variant={activeTab === "dashboard" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={activeTab === "sponsorships" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("sponsorships")}
            >
              <Tag className="mr-2 h-4 w-4" />
              Sponsorship Packages
            </Button>
            <Button 
              variant={activeTab === "inquiries" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("inquiries")}
            >
              <Users className="mr-2 h-4 w-4" />
              Inquiries
            </Button>
            <Button 
              variant={activeTab === "events" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("events")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Events
            </Button>
          </div>

          <div className="mt-auto">
            <div className="flex items-center p-2 rounded-lg bg-primary/5">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/admin-avatar.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@sponsorby.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 bg-background border-b py-4 px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-light">Admin Dashboard</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-64 pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button size="sm">Help</Button>
              </div>
            </div>
          </header>

          <main className="p-6">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Brand Inquiries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{brandInquiries.length}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        +12% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{eventOrganizers.length}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        +5% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Sponsorships
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {packages.filter(p => p.active).length}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {packages.length} total packages available
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Brand Inquiries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {brandInquiries.slice(0, 3).map((inquiry, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{inquiry.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{inquiry.name}</p>
                                <p className="text-xs text-muted-foreground">{inquiry.company}</p>
                              </div>
                            </div>
                            <Badge variant="secondary">AED {inquiry.budget.toLocaleString()}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("inquiries")}>
                        View all
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {eventOrganizers.slice(0, 3).map((event, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{event.company.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{event.eventName}</p>
                                <p className="text-xs text-muted-foreground">{event.company}</p>
                              </div>
                            </div>
                            <Badge>{event.sponsorshipType}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("events")}>
                        View all
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "sponsorships" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-light">Sponsorship Packages</h2>
                  <Button onClick={() => { setEditingPackage(null); reset(); }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Package
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="space-y-4">
                      {packages.map((pkg) => (
                        <Card key={pkg.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{pkg.name}</CardTitle>
                                <CardDescription>{pkg.description}</CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleEdit(pkg)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDelete(pkg.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center mb-4">
                              <div className="text-2xl font-bold">
                                AED {Number(pkg.price).toLocaleString()}
                              </div>
                              <Switch
                                checked={pkg.active}
                                onCheckedChange={(checked) => {
                                  setPackages(
                                    packages.map((p) =>
                                      p.id === pkg.id ? { ...p, active: checked } : p
                                    )
                                  );
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              {pkg.features.map((feature: string, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {editingPackage ? "Edit Package" : "Create Package"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Package Name</Label>
                            <Input
                              id="name"
                              {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && (
                              <p className="text-xs text-destructive">
                                {errors.name.message?.toString()}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                              id="description"
                              {...register("description", {
                                required: "Description is required",
                              })}
                            />
                            {errors.description && (
                              <p className="text-xs text-destructive">
                                {errors.description.message?.toString()}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="price">Price (AED)</Label>
                            <Input
                              id="price"
                              type="number"
                              {...register("price", {
                                required: "Price is required",
                                min: { value: 0, message: "Price must be positive" },
                              })}
                            />
                            {errors.price && (
                              <p className="text-xs text-destructive">
                                {errors.price.message?.toString()}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="features">
                              Features (comma-separated)
                            </Label>
                            <Input
                              id="features"
                              {...register("features", {
                                required: "Features are required",
                              })}
                            />
                            {errors.features && (
                              <p className="text-xs text-destructive">
                                {errors.features.message?.toString()}
                              </p>
                            )}
                          </div>

                          <div className="flex justify-between pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setEditingPackage(null);
                                reset();
                              }}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              {editingPackage ? "Update" : "Create"} Package
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "inquiries" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light">Inquiries</h2>

                <Tabs defaultValue="brands">
                  <TabsList>
                    <TabsTrigger value="brands">Brand Inquiries</TabsTrigger>
                    <TabsTrigger value="events">Event Organizers</TabsTrigger>
                  </TabsList>

                  <TabsContent value="brands" className="pt-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Brand Sponsorship Inquiries</CardTitle>
                        <CardDescription>
                          Companies looking to sponsor events
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {filterInquiries(brandInquiries).map((inquiry, index) => (
                            <Card key={index}>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between">
                                  <div>
                                    <CardTitle>{inquiry.name}</CardTitle>
                                    <CardDescription>{inquiry.title} at {inquiry.company}</CardDescription>
                                  </div>
                                  <Badge>AED {inquiry.budget.toLocaleString()}</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Email:</span>{" "}
                                    {inquiry.email}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Phone:</span>{" "}
                                    {inquiry.phone}
                                  </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="text-sm">{inquiry.message}</div>
                              </CardContent>
                              <CardFooter className="flex justify-between">
                                <Button variant="ghost" size="sm">
                                  Mark as Contacted
                                </Button>
                                <Button size="sm">Reply</Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="events" className="pt-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Event Organizer Inquiries</CardTitle>
                        <CardDescription>
                          Organizations looking for sponsors for their events
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {filterInquiries(eventOrganizers).map((event, index) => (
                            <Card key={index}>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between">
                                  <div>
                                    <CardTitle>{event.eventName}</CardTitle>
                                    <CardDescription>
                                      Organized by {event.company}
                                    </CardDescription>
                                  </div>
                                  <Badge>{event.sponsorshipType}</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Contact:</span>{" "}
                                    {event.name}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Email:</span>{" "}
                                    {event.email}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Phone:</span>{" "}
                                    {event.phone}
                                  </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="text-sm">{event.description}</div>
                              </CardContent>
                              <CardFooter className="flex justify-between">
                                <Button variant="ghost" size="sm">
                                  Mark as Processed
                                </Button>
                                <Button size="sm">Contact</Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeTab === "events" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light">Events Management</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Events Layout Editor</CardTitle>
                    <CardDescription>
                      Create and manage event layouts for sponsorship opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-md flex items-center justify-center h-80">
                      <div className="text-center">
                        <Info className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          The Event Layout Editor is being developed. Check back soon!
                        </p>
                        <Button variant="outline" className="mt-4">
                          Launch Beta Editor
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
