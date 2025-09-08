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
import { useLanguage } from "@/contexts/LanguageContext";
import { translate } from "@/lib/translations";

interface TimelineStep {
  week: number;
  title: string;
  titleTa?: string;
  titleHi?: string;
  description: string;
  descriptionTa?: string;
  descriptionHi?: string;
  type: 'preparation' | 'sowing' | 'care' | 'harvest';
}

interface PlantData {
  id: string;
  name: string;
  nameTa?: string;
  nameHi?: string;
  scientificName: string;
  description: string;
  descriptionTa?: string;
  descriptionHi?: string;
  totalWeeks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeline: TimelineStep[];
}

const plantsDatabase: PlantData[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    nameTa: 'தக்காளி',
    nameHi: 'टमाटर',
    scientificName: 'Solanum lycopersicum',
    description: 'A popular vegetable crop known for its juicy, red fruits rich in vitamins and antioxidants.',
    descriptionTa: 'வைட்டமின்கள் மற்றும் ஆக்ஸிஜனேற்றிகள் நிறைந்த சிவப்பு கனிகளுக்காக அறியப்படும் பிரபலமான காய்கறி பயிர்.',
    descriptionHi: 'एक लोकप्रिय सब्जी फसल जो विटामिन और एंटीऑक्सीडेंट से भरपूर रसदार, लाल फलों के लिए जानी जाती है।',
    totalWeeks: 20,
    difficulty: 'Medium',
    timeline: [
      {
        week: 1,
        title: 'Soil Preparation',
        titleTa: 'மண் தயாரிப்பு',
        titleHi: 'मिट्टी की तैयारी',
        description: 'Prepare well-draining soil with pH 6.0-6.8. Add compost and organic matter.',
        descriptionTa: '6.0-6.8 pH கொண்ட நல்ல நீர் வடிகால் மண்ணை தயார் செய்யுங்கள். கம்போஸ்ட் மற்றும் இயற்கை பொருட்களை சேர்க்கவும்.',
        descriptionHi: '6.0-6.8 pH के साथ अच्छी जल निकासी वाली मिट्टी तैयार करें। कंपोस्ट और जैविक पदार्थ मिलाएं।',
        type: 'preparation'
      },
      {
        week: 2,
        title: 'Seed Starting',
        titleTa: 'விதை விதைப்பு',
        titleHi: 'बीज बुवाई',
        description: 'Start seeds indoors in seed trays. Maintain temperature at 70-75°F.',
        descriptionTa: 'விதை தட்டுகளில் உள்ளே விதைகளை ஆரம்பிக்கவும். 70-75°F வெப்பநிலையை பராமரிக்கவும்.',
        descriptionHi: 'बीज ट्रे में घर के अंदर बीज शुरू करें। 70-75°F तापमान बनाए रखें।',
        type: 'sowing'
      },
      {
        week: 4,
        title: 'Transplant Seedlings',
        titleTa: 'நாற்றுகள் நடுதல்',
        titleHi: 'पौधे रोपाई',
        description: 'Move seedlings to larger pots or outdoor garden after last frost.',
        descriptionTa: 'கடைசி உறைபனிக்குப் பிறகு நாற்றுகளை பெரிய பானைகள் அல்லது வெளிப்புற தோட்டத்திற்கு நகர்த்தவும்.',
        descriptionHi: 'अंतिम ठंढ के बाद पौधों को बड़े गमलों या बाहरी बगीचे में स्थानांतरित करें।',
        type: 'sowing'
      },
      {
        week: 6,
        title: 'First Fertilization',
        titleTa: 'முதல் உரமிடுதல்',
        titleHi: 'पहली खाद',
        description: 'Apply balanced fertilizer (10-10-10) around the base of plants.',
        descriptionTa: 'செடிகளின் அடிப்பகுதியில் சமச்சீர் உரம் (10-10-10) பயன்படுத்தவும்.',
        descriptionHi: 'पौधों के आधार के चारों ओर संतुलित उर्वरक (10-10-10) लगाएं।',
        type: 'care'
      },
      {
        week: 8,
        title: 'Staking and Pruning',
        titleTa: 'ஆதாரம் மற்றும் கத்தரித்தல்',
        titleHi: 'सहारा और छंटाई',
        description: 'Install stakes or cages for support. Prune lower leaves and suckers.',
        descriptionTa: 'ஆதரவுக்காக கம்பங்கள் அல்லது கூண்டுகளை நிறுவவும். கீழ் இலைகள் மற்றும் கிளைகளை கத்தரிக்கவும்.',
        descriptionHi: 'सहारे के लिए डंडे या पिंजरे लगाएं। निचली पत्तियों और अतिरिक्त शाखाओं को काटें।',
        type: 'care'
      },
      {
        week: 10,
        title: 'Flowering Stage',
        titleTa: 'பூக்கும் நிலை',
        titleHi: 'फूल आने का चरण',
        description: 'First flowers appear. Ensure consistent watering and pollination.',
        descriptionTa: 'முதல் பூக்கள் தோன்றுகின்றன. நிலையான நீர்ப்பாசனம் மற்றும் மகரந்தச் சேர்க்கையை உறுதி செய்யுங்கள்.',
        descriptionHi: 'पहले फूल दिखाई देते हैं। निरंतर पानी और परागण सुनिश्चित करें।',
        type: 'care'
      },
      {
        week: 12,
        title: 'Fruit Setting',
        titleTa: 'கனி உருவாதல்',
        titleHi: 'फल लगना',
        description: 'Small green tomatoes begin to form. Continue regular watering.',
        descriptionTa: 'சிறிய பச்சை தக்காளிகள் உருவாக ஆரம்பிக்கின்றன. வழக்கமான நீர்ப்பாசனத்தை தொடருங்கள்.',
        descriptionHi: 'छोटे हरे टमाटर बनने लगते हैं। नियमित पानी देना जारी रखें।',
        type: 'care'
      },
      {
        week: 14,
        title: 'Mid-Season Care',
        titleTa: 'நடு பருவ பராமரிப்பு',
        titleHi: 'मध्य सीजन देखभाल',
        description: 'Apply second round of fertilizer. Monitor for pests and diseases.',
        descriptionTa: 'இரண்டாவது சுற்று உரம் பயன்படுத்தவும். பூச்சிகள் மற்றும் நோய்களை கண்காணிக்கவும்.',
        descriptionHi: 'दूसरा दौर उर्वरक लगाएं। कीटों और बीमारियों की निगरानी करें।',
        type: 'care'
      },
      {
        week: 16,
        title: 'Fruit Development',
        titleTa: 'கனி வளர்ச்சி',
        titleHi: 'फल विकास',
        description: 'Tomatoes grow larger and begin color change. Reduce watering frequency.',
        descriptionTa: 'தக்காளிகள் பெரியதாக வளர்ந்து நிற மாற்றம் ஆரம்பிக்கின்றன. நீர்ப்பாசன அதிர்வெண்ணை குறைக்கவும்.',
        descriptionHi: 'टमाटर बड़े होते हैं और रंग बदलना शुरू करते हैं। पानी देने की आवृत्ति कम करें।',
        type: 'care'
      },
      {
        week: 18,
        title: 'First Harvest',
        titleTa: 'முதல் அறுவடை',
        titleHi: 'पहली फसल',
        description: 'Harvest ripe tomatoes when fully colored but still firm.',
        descriptionTa: 'முழுமையான நிறம் பெற்ற ஆனால் இன்னும் உறுதியான தக்காளிகளை அறுவடை செய்யுங்கள்.',
        descriptionHi: 'पूरी तरह रंगे हुए लेकिन अभी भी मजबूत टमाटरों की कटाई करें।',
        type: 'harvest'
      },
      {
        week: 20,
        title: 'Continuous Harvest',
        titleTa: 'தொடர்ச்சியான அறுவடை',
        titleHi: 'निरंतर फसल',
        description: 'Continue harvesting ripe fruits every 2-3 days through season.',
        descriptionTa: 'பருவம் முழுவதும் 2-3 நாட்களுக்கு ஒருமுறை பழுத்த கனிகளை அறுவடை செய்வதை தொடருங்கள்.',
        descriptionHi: 'सीजन भर हर 2-3 दिन में पके फलों की कटाई जारी रखें।',
        type: 'harvest'
      }
    ]
  },
  {
    id: 'wheat',
    name: 'Wheat',
    nameTa: 'கோதுமை',
    nameHi: 'गेहूं',
    scientificName: 'Triticum aestivum',
    description: 'A cereal grain that is a worldwide staple food and one of the most important crops.',
    descriptionTa: 'உலகளாவிய முக்கிய உணவு தானியம் மற்றும் மிக முக்கியமான பயிர்களில் ஒன்று.',
    descriptionHi: 'एक अनाज जो दुनिया भर में मुख्य भोजन और सबसे महत्वपूर्ण फसलों में से एक है।',
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
    nameTa: 'நெல்',
    nameHi: 'चावल',
    scientificName: 'Oryza sativa',
    description: 'A staple cereal grain that feeds more than half of the world\'s population.',
    descriptionTa: 'உலக மக்கள்தொகையில் பாதிக்கும் மேற்பட்டவர்களுக்கு உணவளிக்கும் முக்கிய தானிய பயிர்.',
    descriptionHi: 'एक मुख्य अनाज जो दुनिया की आधी से अधिक आबादी को भोजन प्रदान करता है।',
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
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  // Helper function to get translated content based on language
  const getPlantName = (plant: PlantData) => {
    switch (language) {
      case 'ta-IN':
        return plant.nameTa || plant.name;
      case 'hi-IN':
        return plant.nameHi || plant.name;
      default:
        return plant.name;
    }
  };

  const getPlantDescription = (plant: PlantData) => {
    switch (language) {
      case 'ta-IN':
        return plant.descriptionTa || plant.description;
      case 'hi-IN':
        return plant.descriptionHi || plant.description;
      default:
        return plant.description;
    }
  };

  const getStepTitle = (step: TimelineStep) => {
    switch (language) {
      case 'ta-IN':
        return step.titleTa || step.title;
      case 'hi-IN':
        return step.titleHi || step.title;
      default:
        return step.title;
    }
  };

  const getStepDescription = (step: TimelineStep) => {
    switch (language) {
      case 'ta-IN':
        return step.descriptionTa || step.description;
      case 'hi-IN':
        return step.descriptionHi || step.description;
      default:
        return step.description;
    }
  };

  // Helper function to get translated difficulty label
  const getDifficultyLabel = (difficulty: PlantData['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return translate('plant.difficulty.easy', language);
      case 'Medium':
        return translate('plant.difficulty.medium', language);
      case 'Hard':
        return translate('plant.difficulty.hard', language);
      default:
        return difficulty;
    }
  };

  // Helper function to get translated type label
  const getTypeLabel = (type: TimelineStep['type']) => {
    switch (type) {
      case 'preparation':
        return translate('plant.type.preparation', language);
      case 'sowing':
        return translate('plant.type.sowing', language);
      case 'care':
        return translate('plant.type.care', language);
      case 'harvest':
        return translate('plant.type.harvest', language);
      default:
        return type;
    }
  };

  const filteredPlants = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    
    return plantsDatabase.filter(plant => {
      const searchLower = searchQuery.toLowerCase();
      return plant.name.toLowerCase().includes(searchLower) ||
             plant.scientificName.toLowerCase().includes(searchLower) ||
             (plant.nameTa && plant.nameTa.includes(searchQuery)) ||
             (plant.nameHi && plant.nameHi.includes(searchQuery));
    });
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
            <h1 className="text-3xl font-bold text-gray-900">{translate('plant.title', language)}</h1>
            <p className="text-gray-600 mt-1">{translate('plant.subtitle', language)}</p>
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
                  placeholder={translate('plant.searchPlaceholder', language)}
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
                        <CardTitle className="text-2xl">{getPlantName(plant)}</CardTitle>
                        <CardDescription className="text-green-100 italic">
                          {plant.scientificName}
                        </CardDescription>
                        <p className="text-green-50 mt-2">{getPlantDescription(plant)}</p>
                      </div>
                      <div className="flex flex-col gap-2 text-right">
                        <Badge className={getDifficultyColor(plant.difficulty)}>
                          {getDifficultyLabel(plant.difficulty)}
                        </Badge>
                        <span className="text-sm text-green-100">
                          {plant.totalWeeks} {translate('plant.weeks', language)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {translate('plant.cultivationTimeline', language)}
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
                                {translate('plant.week', language)} {step.week}
                              </Badge>
                              <Badge className={`text-xs capitalize ${getStepColor(step.type)}`}>
                                {getTypeLabel(step.type)}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-gray-900">{getStepTitle(step)}</h4>
                            <p className="text-gray-600 text-sm mt-1">{getStepDescription(step)}</p>
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
                      <h3 className="text-lg font-medium text-gray-900">{translate('plant.noDataFound', language)}</h3>
                      <p className="text-gray-600 mt-1">
                        {translate('plant.noDataMessage', language)}
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
                  <h3 className="text-lg font-medium text-gray-900">{translate('plant.startSearching', language)}</h3>
                  <p className="text-gray-600 mt-1">
                    {translate('plant.startSearchingMessage', language)}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-green-50"
                      onClick={() => setSearchQuery(language === 'ta-IN' ? 'தக்காளி' : language === 'hi-IN' ? 'टमाटर' : 'Tomato')}
                    >
                      {language === 'ta-IN' ? 'தக்காளி' : language === 'hi-IN' ? 'टमाटर' : 'Tomato'}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-green-50"
                      onClick={() => setSearchQuery(language === 'ta-IN' ? 'கோதுமை' : language === 'hi-IN' ? 'गेहूं' : 'Wheat')}
                    >
                      {language === 'ta-IN' ? 'கோதுமை' : language === 'hi-IN' ? 'गेहूं' : 'Wheat'}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-green-50"
                      onClick={() => setSearchQuery(language === 'ta-IN' ? 'நெல்' : language === 'hi-IN' ? 'चावल' : 'Rice')}
                    >
                      {language === 'ta-IN' ? 'நெல்' : language === 'hi-IN' ? 'चावल' : 'Rice'}
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
