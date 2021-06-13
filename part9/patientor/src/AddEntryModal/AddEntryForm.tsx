import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, useFormikContext} from "formik";

import { TextField, SelectField, TypeOption, DiagnosisSelection, NumberField } from "./FormField";
import { EntryType, HealthCheckRating, NewEntry } from "../types";
import { useStateValue } from "../state";

export type EntryFormValues = NewEntry;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
  type: string;
}

const typeOptions: TypeOption[] = [
  { value: EntryType.HealthCheck, label: "Health Check" },
  { value: EntryType.Hospital, label: "Hospital" },
  { value: EntryType.OccupationalHealthcare, label: "Occupational Healthcare" }
];

const AutoAddForm = () => {
  const {values} = useFormikContext<EntryFormValues>();
  if (values.type === EntryType.HealthCheck){
    return(
      <Field
      label="healthCheckRating"
      name="healthCheckRating"
      component={NumberField}
      min={0}
      max={3}
    />
    );
  } else if (values.type === EntryType.Hospital){
    return(
      <div>
          <Field
            label="Discharge Date"
            placeholder="YYYY-MM-DD"
            name="DischargeDate"
            component={TextField}
          />
          <Field
            label="Criteria"
            placeholder="Description of condition"
            name="criteria"
            component={TextField}
          />
  </div>
    );
  } else {
    return(
      <div>
          <Field
            label="Employer Name"
            placeholder="Employer Name"
            name="employerName"
            component={TextField}
          />
          <Field
            label="Start Date"
            placeholder="YYYY-MM-DD"
            name="startDate"
            component={TextField}
          />
          <Field
            label="End Date"
            placeholder="YYYY-MM-DD"
            name="endDate"
            component={TextField}
          />
      </div>
    );
  }
};

export const AddEntryForm = ({ onSubmit, onCancel, type } : Props ) => {
  const [{ diagnoses }] = useStateValue();
  console.log(type);  
  return (
    <Formik
      initialValues={{
        type: EntryType.HealthCheck,
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        healthCheckRating: HealthCheckRating.LowRisk
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.type) {
          errors.type = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.diagnosisCodes) {
          errors.diagnosisCodes = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <SelectField
              label="Type"
              name="type"
              options={typeOptions}
            />
            <Field
              label="description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />  
            <AutoAddForm/>
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
