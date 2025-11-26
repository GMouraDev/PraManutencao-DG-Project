import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  tooltipData?: Array<{
    label: string;
    value: number;
  }>;
}

export const MetricCard = ({ title, value, icon: Icon, trend, subtitle, tooltipData }: MetricCardProps) => {
  const cardContent = (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
            {trend && (
              <p className={`text-xs sm:text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0 ml-2 border border-primary/20">
            <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (tooltipData && tooltipData.length > 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {cardContent}
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-semibold text-sm">{title} - Detalhamento</p>
              <div className="space-y-1">
                {tooltipData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{item.label}:</span>
                    <span className="font-medium">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
};
