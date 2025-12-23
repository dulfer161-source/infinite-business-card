import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultsDisplayProps {
  results: any;
}

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Все результаты</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
          {JSON.stringify(results, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
