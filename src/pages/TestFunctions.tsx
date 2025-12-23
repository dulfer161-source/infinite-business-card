import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import AuthTests from '@/components/test-functions/AuthTests';
import PasswordTests from '@/components/test-functions/PasswordTests';
import CommunicationTests from '@/components/test-functions/CommunicationTests';
import ResultsDisplay from '@/components/test-functions/ResultsDisplay';

const TestFunctions = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-2">🧪 Тестирование функций</h1>
          <p className="text-gray-600">Проверка всех backend сервисов</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <AuthTests 
            loading={loading} 
            setLoading={setLoading} 
            results={results} 
            setResults={setResults} 
            toast={toast} 
          />
          
          <PasswordTests 
            loading={loading} 
            setLoading={setLoading} 
            results={results} 
            setResults={setResults} 
            toast={toast} 
          />
          
          <CommunicationTests 
            loading={loading} 
            setLoading={setLoading} 
            results={results} 
            setResults={setResults} 
            toast={toast} 
          />
        </div>

        <ResultsDisplay results={results} />
      </div>
    </div>
  );
};

export default TestFunctions;
