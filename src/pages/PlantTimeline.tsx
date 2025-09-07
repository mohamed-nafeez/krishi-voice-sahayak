import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Sprout, 
  Calendar,
  ArrowLeft,
  Clock,
  CheckCircle,
  Leaf
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TimelineStep {
  week: number;
  title: string;
  description: string;
  type: 'preparation' | 'sowing' | 'care' | 'harvest';
}

interface PlantData {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  totalWeeks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeline: TimelineStep[];
}

const plantsDatabase: PlantData[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    description: 'A popular vegetable crop known for its juicy, red fruits rich in vitamins and antioxidants.',
    totalWeeks: 20,
    difficulty: 'Medium',
    timeline: [
      {
        week: 1,
        title: 'Soil Preparation',
        description: 'Prepare well-draining soil with pH 6.0-6.8. Add compost and organic matter.',
        type: 'preparation'
      },
      {
        week: 2,
        title: 'Seed Starting',
        description: 'Start seeds indoors in seed trays. Maintain temperature at 70-75°F.',
        type: 'sowing'
      },
      {
        week: 4,
        title: 'Transplant Seedlings',
        description: 'Move seedlings to larger pots or outdoor garden after last frost.',
        type: 'sowing'
      },
      {
        week: 6,
        title: 'First Fertilization',
        description: 'Apply balanced fertilizer (10-10-10) around the base of plants.',
        type: 'care'
      },
      {
        week: 8,
        title: 'Staking and Pruning',
        description: 'Install stakes or cages for support. Prune lower leaves and suckers.',
        type: 'care'
      },
      {
        week: 10,
        title: 'Flowering Stage',
        description: 'First flowers appear. Ensure consistent watering and pollination.',
        type: 'care'
      },
      {
        week: 12,
        title: 'Fruit Setting',
        description: 'Small green tomatoes begin to form. Continue regular watering.',
        type: 'care'
      },
      {
        week: 14,
        title: 'Mid-Season Care',
        description: 'Apply second round of fertilizer. Monitor for pests and diseases.',
        type: 'care'
      },
      {
        week: 16,
        title: 'Fruit Development',
        description: 'Tomatoes grow larger and begin color change. Reduce watering frequency.',
        type: 'care'
      },
      {
        week: 18,
        title: 'First Harvest',
        description: 'Harvest ripe tomatoes when fully colored but still firm.',
        type: 'harvest'
      },
      {
        week: 20,
        title: 'Continuous Harvest',
        description: 'Continue harvesting ripe fruits every 2-3 days through season.',
        type: 'harvest'
      }
    ]
  },
  {
    id: 'wheat',
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    description: 'A cereal grain that is a worldwide staple food and one of the most important crops.',
    totalWeeks: 24,
    difficulty: 'Easy',
    timeline: [
      {
        week: 1,
        title: 'Field Preparation',
        description: 'Plow the field and prepare a fine seedbed. Ensure proper drainage.',
        type: 'preparation'
      },
      {
        week: 2,
        title: 'Soil Testing',
        description: 'Test soil pH (6.0-7.0 optimal) and nutrient levels. Apply lime if needed.',
        type: 'preparation'
      },
      {
        week: 3,
        title: 'Sowing Seeds',
        description: 'Sow wheat seeds at 120-140 kg/hectare. Plant 2-3 cm deep in rows.',
        type: 'sowing'
      },
      {
        week: 4,
        title: 'Germination',
        description: 'Seeds germinate and young shoots emerge. Monitor for uniform growth.',
        type: 'sowing'
      },
      {
        week: 6,
        title: 'First Irrigation',
        description: 'Apply first irrigation if natural rainfall is insufficient.',
        type: 'care'
      },
      {
        week: 8,
        title: 'Tillering Stage',
        description: 'Plants develop multiple shoots. Apply nitrogen fertilizer.',
        type: 'care'
      },
      {
        week: 12,
        title: 'Stem Elongation',
        description: 'Stems begin to elongate rapidly. Monitor for pests and diseases.',
        type: 'care'
      },
      {
        week: 16,
        title: 'Heading Stage',
        description: 'Wheat heads emerge from the leaf sheath. Critical growth period.',
        type: 'care'
      },
      {
        week: 18,
        title: 'Flowering',
        description: 'Wheat flowers bloom. Ensure adequate moisture during this stage.',
        type: 'care'
      },
      {
        week: 20,
        title: 'Grain Filling',
        description: 'Grains develop and fill with starch. Reduce irrigation gradually.',
        type: 'care'
      },
      {
        week: 22,
        title: 'Maturation',
        description: 'Grains mature and wheat turns golden. Prepare for harvest.',
        type: 'harvest'
      },
      {
        week: 24,
        title: 'Harvest',
        description: 'Harvest when moisture content is 12-14%. Store in dry conditions.',
        type: 'harvest'
      }
    ]
  },
  {
    id: 'rice',
    name: 'Rice',
    scientificName: 'Oryza sativa',
    description: 'A staple cereal grain that feeds more than half of the world\'s population.',
    totalWeeks: 16,
    difficulty: 'Hard',
    timeline: [
      {
        week: 1,
        title: 'Field Preparation',
        description: 'Prepare paddy fields with proper leveling and bunding for water retention.',
        type: 'preparation'
      },
      {
        week: 2,
        title: 'Nursery Preparation',
        description: 'Prepare nursery beds and soak seeds for 24 hours before sowing.',
        type: 'preparation'
      },
      {
        week: 3,
        title: 'Seed Sowing',
        description: 'Sow pre-soaked seeds in nursery beds. Maintain thin water layer.',
        type: 'sowing'
      },
      {
        week: 4,
        title: 'Seedling Care',
        description: 'Maintain nursery with proper water level. Apply light fertilizer.',
        type: 'care'
      },
      {
        week: 5,
        title: 'Transplanting',
        description: 'Transplant 25-30 day old seedlings to main field. Space 20x20 cm.',
        type: 'sowing'
      },
      {
        week: 6,
        title: 'Establishment',
        description: 'Ensure seedlings establish well. Maintain 2-3 cm water depth.',
        type: 'care'
      },
      {
        week: 8,
        title: 'Tillering',
        description: 'Plants produce multiple tillers. Apply nitrogen fertilizer.',
        type: 'care'
      },
      {
        week: 10,
        title: 'Maximum Tillering',
        description: 'Peak tillering stage. Drain water for 3-4 days then refill.',
        type: 'care'
      },
      {
        week: 12,
        title: 'Panicle Initiation',
        description: 'Reproductive phase begins. Maintain continuous flooding.',
        type: 'care'
      },
      {
        week: 13,
        title: 'Flowering',
        description: 'Rice flowers bloom. Critical period for water and nutrient management.',
        type: 'care'
      },
      {
        week: 14,
        title: 'Grain Filling',
        description: 'Grains develop and fill. Maintain field moisture at optimal levels.',
        type: 'care'
      },
      {
        week: 15,
        title: 'Maturation',
        description: 'Grains mature and turn golden. Gradually reduce water levels.',
        type: 'harvest'
      },
      {
        week: 16,
        title: 'Harvest',
        description: 'Harvest when 80% of grains are mature. Dry to 14% moisture content.',
        type: 'harvest'
      }
    ]
  }
];

const getStepIcon = (type: TimelineStep['type']) => {
  switch (type) {
    case 'preparation':
      return <Sprout className="h-4 w-4" />;
    case 'sowing':
      return <Leaf className="h-4 w-4" />;
    case 'care':
      return <Clock className="h-4 w-4" />;
    case 'harvest':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

const getStepColor = (type: TimelineStep['type']) => {
  switch (type) {
    case 'preparation':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'sowing':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'care':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'harvest':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getDifficultyColor = (difficulty: PlantData['difficulty']) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-green-100 text-green-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function PlantTimeline() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlants = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    
    return plantsDatabase.filter(plant =>
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useMemo above
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Plant Cultivation Timeline</h1>
            <p className="text-gray-600 mt-1">Discover step-by-step growing guides for your crops</p>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for plants (e.g., Tomato, Wheat, Rice)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {searchQuery.trim() && (
          <div className="space-y-6">
            {filteredPlants.length > 0 ? (
              filteredPlants.map((plant) => (
                <Card key={plant.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{plant.name}</CardTitle>
                        <CardDescription className="text-green-100 italic">
                          {plant.scientificName}
                        </CardDescription>
                        <p className="text-green-50 mt-2">{plant.description}</p>
                      </div>
                      <div className="flex flex-col gap-2 text-right">
                        <Badge className={getDifficultyColor(plant.difficulty)}>
                          {plant.difficulty}
                        </Badge>
                        <span className="text-sm text-green-100">
                          {plant.totalWeeks} weeks
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Cultivation Timeline
                    </h3>
                    
                    <div className="space-y-4">
                      {plant.timeline.map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`p-2 rounded-full border-2 ${getStepColor(step.type)}`}>
                              {getStepIcon(step.type)}
                            </div>
                            {index < plant.timeline.length - 1 && (
                              <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                Week {step.week}
                              </Badge>
                              <Badge className={`text-xs capitalize ${getStepColor(step.type)}`}>
                                {step.type}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-gray-900">{step.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-gray-100">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">No data found for this plant</h3>
                      <p className="text-gray-600 mt-1">
                        Please try another plant name. Available plants: Tomato, Wheat, Rice
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Initial State */}
        {!searchQuery.trim() && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-green-100">
                  <Sprout className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Start by searching for a plant</h3>
                  <p className="text-gray-600 mt-1">
                    Enter a plant name in the search bar above to see its cultivation timeline
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-green-50"
                      onClick={() => setSearchQuery('Tomato')}
                    >
                      Tomato
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-green-50"
                      onClick={() => setSearchQuery('Wheat')}
                    >
                      Wheat
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-green-50"
                      onClick={() => setSearchQuery('Rice')}
                    >
                      Rice
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
