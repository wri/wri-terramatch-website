import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import FormInput from './FormInput';
import '../../i18n';

it('FormInput renders standard input', () => {
  const {getByTestId} = render(
    <FormInput
      type="text"
      id="text-example"
      label="Example text input"
    />
  );

  expect(getByTestId('input-element')).toBeTruthy();
});

it('FormInput renders password input', () => {
  const {getByTestId} = render(
    <FormInput
      type="password"
      id="text-example"
      label="Example text input"
    />
  );

  expect(getByTestId('input-element')).toBeTruthy();
});

it('FormInput renders textarea input', () => {
  const {getByTestId} = render(
    <FormInput
      type="textarea"
      id="text-example"
      label="Example text input"
    />
  );

  expect(getByTestId('input-element')).toBeTruthy();
});

it('FormInput renders email input', () => {
  const {getByTestId} = render(
    <FormInput
      type="email"
      id="text-example"
      label="Example text input"
    />
  );

  expect(getByTestId('input-element')).toBeTruthy();
});

it('FormInput renders toggle', () => {
  const {getByTestId} = render(
    <FormInput
      type="toggle"
      className="u-margin-bottom-small"
      id="toggle-example"
      label="Example Toggle input"
    />
  );

  expect(getByTestId('toggle-element')).toBeTruthy();
});

it('FormInput renders checkbox', () => {
  const {getByTestId} = render(
    <FormInput
      type="checkbox"
      className="u-margin-bottom-small"
      id="toggle-example"
      label="Example Toggle input"
    />
  );

  expect(getByTestId('radio-checkbox-element')).toBeTruthy();
});

it('FormInput renders radio', () => {
  const {getByTestId} = render(
    <FormInput
      type="radio"
      className="u-margin-bottom-small"
      id="toggle-example"
      label="Example Radio input"
    />
  );

  expect(getByTestId('radio-checkbox-element')).toBeTruthy();
});

it('FormInput fires change on text update', () => {
  const mockFunction = jest.fn();
  const {getByLabelText} = render(<FormInput
    type="text"
    id="text-example"
    label="text input"
    onChange={mockFunction}
  />)
  fireEvent.change(getByLabelText('text input'), {target: {value: 'foo'}})

  expect(mockFunction.mock.calls.length).toBe(1);
});

it('FormInput fires change on toggle update', () => {
  const mockFunction = jest.fn();
  const {getByLabelText} = render(<FormInput
    type="toggle"
    id="text-example"
    label="toggle input"
    onChange={mockFunction}
  />)
  fireEvent.click(getByLabelText('toggle input'));

  expect(mockFunction.mock.calls.length).toBe(1);
});

it('FormInput fires change on radio update', () => {
  const mockFunction = jest.fn();
  const {getByLabelText} = render(<FormInput
    type="radio"
    id="text-example"
    label="radio input"
    onChange={mockFunction}
  />)
  fireEvent.click(getByLabelText('radio input'));

  expect(mockFunction.mock.calls.length).toBe(1);
});

it('FormInput fires change on checkbox update', () => {
  const mockFunction = jest.fn();
  const {getByLabelText} = render(<FormInput
    type="checkbox"
    id="text-example"
    label="checkbox input"
    onChange={mockFunction}
  />)
  fireEvent.click(getByLabelText('checkbox input'));

  expect(mockFunction.mock.calls.length).toBe(1);
});

it('FormInput Radio Group renders', async () => {
  const {findAllByTestId} = render(
    <FormInput
      type="radioGroup"
      label="Radio Group"
      id="radiogroup"
      className="u-margin-bottom-small"
      showLabel
      data={[
        {
          value: '1',
          label: 'Option 1'
        },
        {
          value: '2',
          label: 'Option 2'
        },
        {
          value: '3',
          label: 'Option 3'
        }
      ]}
      onChange={() => {}}
    />
  );
  const elements = await findAllByTestId('radio-checkbox-element');
  expect(elements.length).toEqual(3);
});

it('FormInput Radio Group fires change on radio update', async () => {
  const mockFunction = jest.fn((e) => e);

  const {findAllByTestId} = render(
    <FormInput
      type="radioGroup"
      label="Radio Group"
      id="radiogroup"
      className="u-margin-bottom-small"
      showLabel
      onChange={mockFunction}
      data={[
        {
          value: '1',
          label: 'Option 1'
        },
        {
          value: '2',
          label: 'Option 2'
        },
        {
          value: '3',
          label: 'Option 3'
        }
      ]}
    />
  );
  const elements = await findAllByTestId('radio-checkbox-element');
  fireEvent.click(elements[1]);
  expect(mockFunction.mock.calls.length).toEqual(1);
  expect(mockFunction.mock.results[0].value.value).toEqual('2');
});


it('FormInput Checkbox Group renders', async () => {
  const {findAllByTestId} = render(
    <FormInput
      type="checkboxGroup"
      label="Checkbox Group"
      id="checkboxgroup"
      className="u-margin-bottom-small"
      showLabel
      data={[
        {
          value: '1',
          label: 'Option 1'
        },
        {
          value: '2',
          label: 'Option 2'
        },
        {
          value: '3',
          label: 'Option 3'
        }
      ]}
      onChange={() => {}}
    />
  );
  const elements = await findAllByTestId('radio-checkbox-element');
  expect(elements.length).toEqual(3);
});

it('FormInput Checkbox group fires change on radio update', async () => {
  const mockFunction = jest.fn((e) => e);

  const {findAllByTestId} = render(
    <FormInput
      type="checkboxGroup"
      label="Checkbox Group"
      id="checkboxgroup"
      className="u-margin-bottom-small"
      showLabel
      onChange={mockFunction}
      data={[
        {
          value: '1',
          label: 'Option 1'
        },
        {
          value: '2',
          label: 'Option 2'
        },
        {
          value: '3',
          label: 'Option 3'
        }
      ]}
    />
  );
  const elements = await findAllByTestId('radio-checkbox-element');
  fireEvent.click(elements[1]);
  expect(mockFunction.mock.calls.length).toEqual(2);
});
