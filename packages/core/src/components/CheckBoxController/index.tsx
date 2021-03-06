import React from 'react';
import uuid from 'uuid/v4';
import shallowEqual from 'shallowequal';
import proxyComponent from '../../utils/proxyComponent';
import FormField, { Props as FormFieldProps, partitionFieldProps } from '../FormField';
import CheckBox, { Props as CheckBoxProps } from '../CheckBox';

export type PropsProvided = Partial<CheckBoxProps> & {
  label: NonNullable<React.ReactNode>;
  value: string;
};

export type Props = FormFieldProps & {
  /** Function children in which CheckBox components can be rendered. */
  children: (component: React.ComponentType<PropsProvided>, values: string[], id: string) => void;
  /** Unique name of the field. */
  name: string;
  /** Callback that is triggered when a child CheckBox is clicked. */
  onChange: (values: string[], event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Default checked values. */
  value?: string[];
};

export type State = {
  id: string;
  values: Set<string>;
};

/** Manage multiple checkboxes with the same input `name`. */
export default class CheckBoxController extends React.Component<Props, State> {
  static defaultProps = {
    value: [],
  };

  state = {
    id: uuid(),
    values: new Set(this.props.value),
  };

  componentDidUpdate(prevProps: Props) {
    if (!shallowEqual(this.props.value, prevProps.value!)) {
      this.setState({
        values: new Set(this.props.value),
      });
    }
  }

  private handleChange = (
    checked: boolean,
    value: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.setState(
      prevState => {
        const values = new Set(prevState.values);

        if (checked) {
          values.add(value);
        } else {
          values.delete(value);
        }

        return {
          values,
        };
      },
      () => {
        this.props.onChange(Array.from(this.state.values), event);
      },
    );
  };

  renderCheckBox = proxyComponent(CheckBox, ({ value, ...props }: PropsProvided) => {
    const { inputProps } = partitionFieldProps(this.props);
    const { id, values } = this.state;

    return (
      <CheckBox
        compactSpacing
        {...props}
        {...inputProps}
        id={`${id}-${value}`}
        value={value}
        checked={values.has(value)}
        onChange={this.handleChange}
        hideOptionalLabel
      />
    );
  });

  render() {
    const { children, fieldProps } = partitionFieldProps(this.props);
    const { id, values } = this.state;

    return (
      <FormField {...fieldProps} id={id}>
        {children(this.renderCheckBox, Array.from(values), id)}
      </FormField>
    );
  }
}
