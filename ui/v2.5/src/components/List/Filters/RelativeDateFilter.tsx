import React from "react";
import { Form } from "react-bootstrap";
import { useIntl } from "react-intl";
import { TimeUnit } from "../../../core/generated-graphql";
import { IRelativeDateValue } from "../../../models/list-filter/types";
import { ModifierCriterion } from "../../../models/list-filter/criteria/criterion";

interface IRelativeDateFilterProps {
  criterion: ModifierCriterion<IRelativeDateValue>;
  onValueChanged: (value: IRelativeDateValue) => void;
}

export const RelativeDateFilter: React.FC<IRelativeDateFilterProps> = ({
  criterion,
  onValueChanged,
}) => {
  const intl = useIntl();

  const { value } = criterion;

  function onValueChange(newValue: number) {
    onValueChanged({
      value: newValue,
      unit: value?.unit ?? TimeUnit.Days,
    });
  }

  function onUnitChange(newUnit: TimeUnit) {
    onValueChanged({
      value: value?.value ?? 30,
      unit: newUnit,
    });
  }

  return (
    <>
      <Form.Group>
        <Form.Control
          type="number"
          value={value?.value ?? 30}
          onChange={(e) => onValueChange(parseInt(e.target.value, 10))}
          placeholder={intl.formatMessage({ id: "criterion.value" })}
          min="1"
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          as="select"
          value={value?.unit ?? TimeUnit.Days}
          onChange={(e) => onUnitChange(e.target.value as TimeUnit)}
        >
          <option value={TimeUnit.Days}>
            {intl.formatMessage({ id: "time_unit.days" })}
          </option>
          <option value={TimeUnit.Months}>
            {intl.formatMessage({ id: "time_unit.months" })}
          </option>
          <option value={TimeUnit.Years}>
            {intl.formatMessage({ id: "time_unit.years" })}
          </option>
        </Form.Control>
      </Form.Group>
    </>
  );
};