import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parts, workshops, vehicleModels, statesData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package } from "lucide-react";
import { useState } from "react";

const categories = ["MOTOR", "TRANSMISSÃO", "SUSPENSÃO", "FREIOS", "ACESSÓRIOS"];

export const PartsComparison = () => {
  const [selectedState, setSelectedState] = useState<string>("SP");
  const [selectedCategory, setSelectedCategory] = useState<string>("MOTOR");
  const [selectedModel, setSelectedModel] = useState<string>("v1");

  const states = statesData.map(s => s.state);
  const filteredParts = parts.filter(p => p.category === selectedCategory);
  const stateWorkshops = workshops.filter(w => w.state === selectedState);

  const chartData = filteredParts.slice(0, 5).map(part => {
    const dataPoint: any = { name: part.name };
    const kmForModel = part.kmUntilWearByModel.find(k => k.modelId === selectedModel);
    
    stateWorkshops.forEach(workshop => {
      const price = part.prices.find(p => p.workshopId === workshop.id);
      if (price) {
        dataPoint[workshop.name] = price.price;
      }
    });
    
    dataPoint.kmUntilWear = kmForModel?.km || 0;
    
    return dataPoint;
  });

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Comparação de Preços de Peças
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Modelo" />
              </SelectTrigger>
              <SelectContent>
                {vehicleModels.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.brand} {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-[400px] sm:h-[500px] w-full bg-gradient-to-br from-card to-primary/5 rounded-lg p-2 sm:p-4 border border-primary/10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <defs>
                  {stateWorkshops.map((workshop, idx) => (
                    <linearGradient key={workshop.id} id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={`hsl(var(--chart-${(idx % 5) + 1}))`} stopOpacity={0.9}/>
                      <stop offset="100%" stopColor={`hsl(var(--chart-${(idx % 5) + 1}))`} stopOpacity={0.6}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  angle={-35}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  tickFormatter={(value) => `R$ ${value}`}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  stroke="hsl(var(--border))"
                />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Preço"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "2px solid hsl(var(--primary))",
                    borderRadius: "0.75rem",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ 
                    color: "hsl(var(--foreground))", 
                    fontWeight: "bold",
                    marginBottom: "8px" 
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                {stateWorkshops.map((workshop, idx) => (
                  <Bar 
                    key={workshop.id}
                    dataKey={workshop.name}
                    fill={`url(#gradient-${idx})`}
                    name={workshop.name}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredParts.slice(0, 8).map(part => {
              const kmForModel = part.kmUntilWearByModel.find(k => k.modelId === selectedModel);
              const partWorkshopPrices = part.prices
                .filter(p => stateWorkshops.some(w => w.id === p.workshopId))
                .map(p => ({
                  workshop: workshops.find(w => w.id === p.workshopId)?.name,
                  price: p.price
                }));
              
              return (
                <Card key={part.id} className="bg-card border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-2 border-b border-primary/10">
                    <CardTitle className="text-sm text-foreground">{part.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      KM até desgaste: {kmForModel?.km.toLocaleString() || "N/A"}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {partWorkshopPrices.map((wp, idx) => (
                        <div key={idx} className="flex justify-between text-xs py-1">
                          <span className="text-muted-foreground truncate max-w-[120px]">{wp.workshop}</span>
                          <span className="font-semibold text-primary">R$ {wp.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
