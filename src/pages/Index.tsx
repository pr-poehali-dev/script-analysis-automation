import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface SceneData {
  number: string;
  location: string;
  timeOfDay: string;
  characters: string[];
  props: string[];
  sfx: string[];
  extras: string;
}

const mockScenes: SceneData[] = [
  {
    number: '1',
    location: 'Офис редакции',
    timeOfDay: 'День',
    characters: ['Анна', 'Борис', 'Сергей'],
    props: ['Ноутбук', 'Кофе', 'Документы'],
    sfx: [],
    extras: '5-7 человек'
  },
  {
    number: '2',
    location: 'Улица города',
    timeOfDay: 'Вечер',
    characters: ['Анна', 'Виктор'],
    props: ['Автомобиль', 'Телефон'],
    sfx: ['Дождь'],
    extras: '15-20 человек'
  },
  {
    number: '3',
    location: 'Кафе',
    timeOfDay: 'День',
    characters: ['Анна', 'Марина'],
    props: ['Меню', 'Посуда'],
    sfx: [],
    extras: '3-5 человек'
  }
];

const Index = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisPreset, setAnalysisPreset] = useState('extended');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => setActiveTab('table'), 500);
        }
      }, 200);
    }
  };

  const filteredScenes = mockScenes.filter(scene => 
    scene.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scene.characters.some(char => char.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    totalScenes: mockScenes.length,
    locations: new Set(mockScenes.map(s => s.location)).size,
    characters: new Set(mockScenes.flatMap(s => s.characters)).size,
    dayScenes: mockScenes.filter(s => s.timeOfDay === 'День').length,
    nightScenes: mockScenes.filter(s => s.timeOfDay === 'Вечер' || s.timeOfDay === 'Ночь').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Film" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary">ScriptFlow</h1>
                <p className="text-xs text-muted-foreground">Автоматизация препродакшн-документации</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-2">
                <Icon name="Cpu" size={14} />
                Локальная обработка
              </Badge>
              <Button variant="outline" size="sm">
                <Icon name="Settings" size={16} className="mr-2" />
                Настройки
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="upload" className="gap-2">
              <Icon name="Upload" size={16} />
              Загрузка
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <Icon name="Table" size={16} />
              Таблица
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <Icon name="BarChart3" size={16} />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <Icon name="Download" size={16} />
              Экспорт
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6 animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="FileText" size={24} />
                    Загрузка сценария
                  </CardTitle>
                  <CardDescription>
                    Поддерживаются форматы PDF и DOCX до 120 страниц
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-all hover:border-primary group">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon name="Upload" size={32} className="text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium">Перетащите файл сюда</p>
                        <p className="text-sm text-muted-foreground mt-1">или нажмите для выбора</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">PDF</Badge>
                        <Badge variant="secondary">DOCX</Badge>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx"
                      onChange={handleFileUpload}
                    />
                  </label>
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-6 space-y-2 animate-fade-in">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Обработка документа...</span>
                        <span className="font-medium">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Пресеты анализа</CardTitle>
                  <CardDescription>Выберите набор элементов для распознавания</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={analysisPreset} onValueChange={setAnalysisPreset}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Базовый</SelectItem>
                      <SelectItem value="extended">Расширенный</SelectItem>
                      <SelectItem value="full">Полный</SelectItem>
                      <SelectItem value="custom">Настраиваемый</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Icon name="MapPin" size={16} className="text-primary" />
                      <span>Локации и время суток</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Icon name="Users" size={16} className="text-primary" />
                      <span>Персонажи и массовка</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Icon name="Package" size={16} className="text-primary" />
                      <span>Реквизит</span>
                    </div>
                    {analysisPreset !== 'basic' && (
                      <>
                        <div className="flex items-center gap-3 text-sm">
                          <Icon name="Zap" size={16} className="text-primary" />
                          <span>Спецэффекты</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Icon name="Car" size={16} className="text-primary" />
                          <span>Транспорт</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Технические характеристики</CardTitle>
                  <CardDescription>Параметры обработки</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Макс. размер документа</span>
                    <Badge>120 страниц</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Время обработки</span>
                    <Badge>до 5 минут</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Режим работы</span>
                    <Badge variant="outline" className="gap-1">
                      <Icon name="Shield" size={12} />
                      Офлайн
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Кодировки</span>
                    <Badge variant="secondary">UTF-8, CP1251</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="table" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Таблица сцен</CardTitle>
                    <CardDescription>Результаты анализа сценария</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Поиск по локациям, персонажам..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">№</TableHead>
                        <TableHead className="font-semibold">Локация</TableHead>
                        <TableHead className="font-semibold">Время</TableHead>
                        <TableHead className="font-semibold">Персонажи</TableHead>
                        <TableHead className="font-semibold">Реквизит</TableHead>
                        <TableHead className="font-semibold">Спецэффекты</TableHead>
                        <TableHead className="font-semibold">Массовка</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredScenes.map((scene) => (
                        <TableRow key={scene.number} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{scene.number}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon name="MapPin" size={14} className="text-primary" />
                              {scene.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {scene.timeOfDay === 'День' ? (
                                <Icon name="Sun" size={12} className="mr-1" />
                              ) : (
                                <Icon name="Moon" size={12} className="mr-1" />
                              )}
                              {scene.timeOfDay}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {scene.characters.map((char, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {char}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {scene.props.map((prop, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {prop}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {scene.sfx.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {scene.sfx.map((effect, i) => (
                                  <Badge key={i} className="text-xs">
                                    <Icon name="Zap" size={10} className="mr-1" />
                                    {effect}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {scene.extras}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Всего сцен</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="Film" size={24} className="text-primary" />
                    </div>
                    <span className="text-3xl font-bold">{stats.totalScenes}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Локаций</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="MapPin" size={24} className="text-primary" />
                    </div>
                    <span className="text-3xl font-bold">{stats.locations}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Персонажей</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="Users" size={24} className="text-primary" />
                    </div>
                    <span className="text-3xl font-bold">{stats.characters}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">День / Вечер</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="Clock" size={24} className="text-primary" />
                    </div>
                    <span className="text-3xl font-bold">{stats.dayScenes} / {stats.nightScenes}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Распределение по локациям</CardTitle>
                  <CardDescription>Количество сцен в каждой локации</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from(new Set(mockScenes.map(s => s.location))).map((location) => {
                    const count = mockScenes.filter(s => s.location === location).length;
                    const percentage = (count / mockScenes.length) * 100;
                    return (
                      <div key={location} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{location}</span>
                          <span className="text-muted-foreground">{count} сцен</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Главные персонажи</CardTitle>
                  <CardDescription>Количество сцен с участием персонажа</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from(new Set(mockScenes.flatMap(s => s.characters))).map((character) => {
                    const count = mockScenes.filter(s => s.characters.includes(character)).length;
                    const percentage = (count / mockScenes.length) * 100;
                    return (
                      <div key={character} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{character}</span>
                          <span className="text-muted-foreground">{count} сцен</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Экспорт данных</CardTitle>
                <CardDescription>Сохраните результаты анализа в удобном формате</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button size="lg" className="h-24 flex-col gap-2">
                    <Icon name="FileSpreadsheet" size={32} />
                    <span>Экспорт в XLSX</span>
                  </Button>
                  <Button size="lg" variant="outline" className="h-24 flex-col gap-2">
                    <Icon name="FileText" size={32} />
                    <span>Экспорт в CSV</span>
                  </Button>
                </div>

                <div className="border rounded-lg p-6 bg-muted/30">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Icon name="Settings2" size={20} />
                    Параметры экспорта
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Включить заголовки столбцов</span>
                      <Badge variant="outline">Да</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Кодировка</span>
                      <Badge variant="outline">UTF-8</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Разделитель CSV</span>
                      <Badge variant="outline">Точка с запятой</Badge>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-primary/5 border-primary/20">
                  <div className="flex items-start gap-3">
                    <Icon name="Info" size={20} className="text-primary mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">Совместимость с Excel и Google Sheets</p>
                      <p className="text-sm text-muted-foreground">
                        Экспортированные файлы полностью совместимы с Microsoft Excel, Google Sheets и другими табличными редакторами
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
