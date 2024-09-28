import { Trash2 } from 'lucide-react';

import { Button } from '~/components/atoms/Button';
import { Dialog } from '~/components/molecules/Dialog';
import { Form, type FormRootProps } from '~/components/organisms/Form';

export const GameDataDialogRoot = ({ open, title, form, onSubmit, onOpenChange, onDelete, children }: GameDataDialogRootProps) => {
  const handleSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.form?.requestSubmit(event.currentTarget);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-4xl w-screen">
        <Form.Root {...form}>
          <form
            className="flex flex-col space-y-10"
            onSubmit={onSubmit}
          >
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body className="flex flex-col space-y-8">
              {children}
            </Dialog.Body>

            <Dialog.Footer>
              <Button onClick={handleSave} type="submit">
                Save changes
              </Button>

              <Dialog.Close asChild>
                <Button>Cancel</Button>
              </Dialog.Close>

              {onDelete && (
                <span className="pl-3">
                  <Dialog.Close asChild>
                    <Button variant="destructive" onClick={onDelete}>
                      <Trash2 className="mr-2 w-5" />
                      Delete
                    </Button>
                  </Dialog.Close>
                </span>
              )}
            </Dialog.Footer>
          </form>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export interface GameDataDialogRootProps {
  open: boolean;
  title: React.ReactNode;
  form: Omit<FormRootProps<any>, 'children'>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  onOpenChange?: (open: boolean) => void;
  onDelete?: React.FormEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}
