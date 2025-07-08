'use client';

import { Button } from '@/components/shadcn-ui/button';
import { Card, CardContent } from '@/components/shadcn-ui/card';
import { Checkbox } from '@/components/shadcn-ui/checkbox';
import { DateTimePicker } from '@/components/shadcn-ui/date-time-picker';
import { Input } from '@/components/shadcn-ui/input';
import { Label } from '@/components/shadcn-ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/shadcn-ui/select';

const CenterControl = () => {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="grid grid-cols-4 gap-2">
          <Input placeholder="Event Title" />
          <Input placeholder="Location" />
          <Input placeholder="Start Date" />
          <Input placeholder="End Date" />
          <Input placeholder="Created Date" />
          <Select>
            <SelectTrigger>Test</SelectTrigger>
            <SelectContent>
              <SelectItem value="test1">Test 1</SelectItem>
              <SelectItem value="test2">Test 2</SelectItem>
              <SelectItem value="test3">Test 3</SelectItem>
            </SelectContent>
          </Select>
          <DateTimePicker granularity="day" />
          <div className="flex items-center gap-2 w-full text-gray-500">
            <Checkbox id="terms" />
            Accept terms and conditions
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-2">
          <Button variant="outline">Test</Button>
          <Button variant="outline">Test</Button>
          <Button variant="outline">Test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CenterControl;
