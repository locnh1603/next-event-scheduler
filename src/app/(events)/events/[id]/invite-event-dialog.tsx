'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/shadcn-ui/form';
import { customFetch } from '@/services/app/client/client-fetch';
import { env } from '@env';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/shadcn-ui/input';
import { Button } from '@/components/shadcn-ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn-ui/table';
import { EventCommands } from '@/enums/event.enum';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/shadcn-ui/spinner';
import { AppError } from '@/utilities/error-handler';
const eventInviteFormSchema = z.object({
  email: z.string().min(1, {
    message: 'Email is required.',
  }),
});
type EventInviteFormData = z.infer<typeof eventInviteFormSchema>;

type UserInviteDisplayData = {
  email: string;
};

const InviteEventDialog = (props: {
  eventId: string;
  children: React.ReactNode;
}) => {
  const { eventId, children } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Array<UserInviteDisplayData>>([]);
  const [open, setOpen] = useState(false);
  const form = useForm<EventInviteFormData>({
    resolver: zodResolver(eventInviteFormSchema),
    defaultValues: {
      email: '',
    },
  });
  const columnHelper = createColumnHelper<UserInviteDisplayData>();
  const onSendInvite = async () => {
    setLoading(true);
    const body = JSON.stringify({
      payload: {
        eventId,
        emails: data.map((item) => item.email),
      },
      command: EventCommands.inviteEmails,
    });
    try {
      const url = `${env.NEXT_PUBLIC_API_URL}/events`;
      await customFetch(url, {
        body,
        method: 'POST',
      });
      setLoading(false);
      setOpen(false);
    } catch (error) {
      let errorMessage = 'Unknown error';
      if (error instanceof AppError) {
        errorMessage = error.message || 'Unknown error';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error('Failed to send invitations: ' + errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: EventInviteFormData) => {
    const { email } = data;
    addEmail(email);
  };

  const removeEmailByIndex = (index: number) => {
    const newEmails = [...data];
    newEmails.splice(index, 1);
    setData(newEmails);
  };

  const addEmail = (email: string) => {
    const isDuplicate = data.some((item) => item.email === email);

    if (!isDuplicate) {
      const emails = [...data, { email }];
      setData(emails);
      form.reset();
    } else {
      toast.error(
        'This email is already in the invitation list. Please enter a different email.'
      );
    }
  };

  const columns = [
    columnHelper.display({
      id: 'No.',
      cell: (info) => info.row.index + 1,
    }),
    columnHelper.accessor('email', {
      id: 'email',
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'action',
      size: 10,
      cell: (info) => (
        <Button
          onClick={() => removeEmailByIndex(info.row.index)}
          aria-label="Remove email"
          size="sm"
          className="w-full"
          variant="ghost"
        >
          <Minus color="black" />
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Participants</DialogTitle>
          <DialogDescription>Invite users by their emails.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {loading ? (
              <div>Loading</div>
            ) : (
              <div>
                <div>
                  Invitation List
                  <Table>
                    <TableCaption>
                      List of email to send Invitation
                    </TableCaption>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead
                                key={header.id}
                                style={{ width: `${header.getSize()}%` }}
                                colSpan={header.colSpan}
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && 'selected'}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-12 text-center"
                          >
                            No data.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <div className="flex w-full items-center gap-2">
                            <Input
                              type="email"
                              placeholder="Enter user email"
                              {...field}
                            />
                            <Button type="submit" aria-label="Add email">
                              <Plus color="#ffffff" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </>
                    )}
                    name="email"
                  />
                </div>
              </div>
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={onSendInvite} disabled={loading}>
            {loading ? (
              <Spinner size="small" className="text-white" />
            ) : (
              'Send Invitations'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteEventDialog;
