import zod from 'zod';
import { redirect, useFetcher } from '@remix-run/react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { Typography } from '~/components/atoms/Typography';
import { Button } from '~/components/atoms/Button';
import { Input } from '~/components/molecules/Input';
import { Select } from '~/components/molecules/Select';
import { game } from '~/game';
import { classList } from '~/game/enums';
import { Form } from '~/components/organisms/Form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRef } from 'react';
import { DB } from '~/database';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Game - Dragon Realm' },
    { name: 'description', content: 'New Game menu' },
  ];
};

const actionSchema = zod.object({
  name: zod
    .string()
    .trim()
    .min(3, 'Name must contain at least 3 characters')
    .max(50, 'Name must contain no more than 50 characters'),
  class: zod.enum(classList, { message: 'Invalid class' }),
});

type FormValues = zod.infer<typeof actionSchema>;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const body = Object.fromEntries([...formData.entries()].map(([key, value]) => [key, value.toString()]));
  const result = await actionSchema.safeParseAsync(body);

  const errors: Record<string, string> = {};

  if (result.error) {
    for (const issue of result.error.issues) {
      errors[issue.path.join('.')] = issue.message;
    }

    return json({ values: body, errors }, { status: 400 });
  }

  const startArea = await game.area.findById('dragon-realm:mountain-range');

  if (!startArea) {
    throw new Error('Missing data of the start area');
  }

  const startLocation = startArea.locations.find(location => location.id === 'dragon-realm:waterfall');

  if (!startLocation) {
    throw new Error('Missing data of the start location');
  }

  const character = await game.character.create({
    name: result.data.name,
    class: result.data.class,
  });

  const save = await DB.save.create({
    name: result.data.name,
    characters: [character],
    currentArea: startArea.id,
    currentLocation: startLocation.id,
  });

  return redirect(`/games/${save._id}`);
}

export default function NewGame() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(actionSchema),
  });
  const fetcher = useFetcher<typeof action>();

  const handleSubmit: SubmitHandler<FormValues> = () => {
    if (formRef.current) {
      fetcher.submit(formRef.current);
    }
  }

  return (
    <>
      <Typography variant="h1" className="pb-4">New Game</Typography>

      <Form.Root {...form}>
        <fetcher.Form
          ref={formRef}
          method="post"
          className="flex flex-col items-center space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Form.Field
            control={form.control}
            name="name"
            render={({ field }) => (
              <Form.Item className="flex flex-col w-[25ch]">
                <Form.Label>Name</Form.Label>

                <Form.Control>
                  <Input {...field} />
                </Form.Control>

                <Form.Message>{fetcher.data?.errors.name}</Form.Message>
              </Form.Item>
            )}
          />
          {/*<Input
            label="Name"
            name="name"
            defaultValue={actionData?.values.name}
            helperText={actionData?.errors.name}
            error={Boolean(actionData?.errors.name)}
            className="w-[25ch]"
          />*/}

          <Form.Field
            control={form.control}
            name="class"
            render={({ field }) => (
              <Form.Item className="flex flex-col w-[25ch]">
                <Form.Label>Class</Form.Label>

                <Form.Control>
                  <Select.Root {...field} onValueChange={field.onChange}>
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>

                    <Select.Content>
                      {classList.map(characterClass => (
                        <Select.Item key={characterClass} value={characterClass}>
                          {characterClass}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Form.Control>

                <Form.Message>{fetcher.data?.errors.class}</Form.Message>
              </Form.Item>
            )}
          />

          <Button type="submit">
            Create
          </Button>
        </fetcher.Form>
      </Form.Root>
    </>
  );
}
