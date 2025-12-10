import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity, 
  AlertTriangle, 
  Zap, 
  Smile,
  Briefcase,
  Rocket,
  Heart,
  Coins,
  Building,
  Award
} from 'lucide-react';

export const IconTrendingUp = ({ className }: { className?: string }) => <TrendingUp className={className} />;
export const IconTrendingDown = ({ className }: { className?: string }) => <TrendingDown className={className} />;
export const IconUsers = ({ className }: { className?: string }) => <Users className={className} />;
export const IconDollar = ({ className }: { className?: string }) => <Coins className={className} />; // Changed to Coins
export const IconActivity = ({ className }: { className?: string }) => <Activity className={className} />;
export const IconAlert = ({ className }: { className?: string }) => <AlertTriangle className={className} />;
export const IconZap = ({ className }: { className?: string }) => <Zap className={className} />;
export const IconSmile = ({ className }: { className?: string }) => <Smile className={className} />;
export const IconBriefcase = ({ className }: { className?: string }) => <Briefcase className={className} />;
export const IconRocket = ({ className }: { className?: string }) => <Rocket className={className} />; // New
export const IconHeart = ({ className }: { className?: string }) => <Heart className={className} />; // New
export const IconBuilding = ({ className }: { className?: string }) => <Building className={className} />; // New
export const IconAward = ({ className }: { className?: string }) => <Award className={className} />; // New