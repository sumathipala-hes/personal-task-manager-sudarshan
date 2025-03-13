import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface TaskCardProps {
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  categories: string[];
}

export default function TaskCard({
  title,
  description,
  priority,
  status,
  dueDate,
  categories
}: TaskCardProps) {

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow bg-[#D5E5D5] h-full"
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="outline" className={`${getPriorityColor(priority)} text-white`}>
              {priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Due: {formatDateTime(dueDate)}</span>
            </div>
            <Badge variant="secondary" className={`${getStatusColor(status)} w-fit`}>
              {status.replace('_', ' ')}
            </Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <Badge key={index} variant="outline" className="bg-[#C7D9DD]">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}