import React from "react";
import { ErrorMessage, Formik } from "formik";
import { Col, Form } from "react-bootstrap";
import { Button } from "../components";
import { isArray, isString } from "../utils/helpers";
import { get, isEmpty } from "lodash";

export const useForm = () => {
  const getInitialValues = (data) =>
    data.reduce((acc, cv) => {
      if (isArray(cv)) cv.forEach((v) => v.name && (acc[v.name] = ""));
      if (cv.name) acc[cv.name] = "";
      return acc;
    }, {});

  const renderOptions = (
    options = [],
    hasBlankOption = false,
    optionsAccessors = {}
  ) => {
    if (!isArray(options) || isEmpty(options)) return;
    return (
      <>
        {hasBlankOption && <option value="" />}
        {options.map((opt, idx) => {
          const value = isString(opt) ? opt : get(opt, optionsAccessors.value);
          const label = isString(opt) ? opt : get(opt, optionsAccessors.label);
          if (!value || !label) return null;
          return (
            <option key={idx} value={value}>
              {label}
            </option>
          );
        })}
      </>
    );
  };

  const renderCol = ({
    errors,
    handleBlur,
    handleChange,
    row,
    touched,
    values,
  }) => (
    <Col
      {...{
        key: row.name,
        ...(row.size && { md: row.size }),
      }}
    >
      <Form.Label>
        {row.label}
        {row.isRequired && (
          <strong className="text-danger" title="Requerido">
            *
          </strong>
        )}
      </Form.Label>
      <Form.Control
        {...{
          isInvalid: touched[row.name] && !!errors[row.name],
          isValid: touched[row.name] && !errors[row.name],
          name: row.name,
          onBlur: handleBlur,
          onChange: handleChange,
          type: row.type ? row.type : "text",
          ...(row.defaultValue && { defaultValue: row.defaultValue }),
          ...(row.maxLength && { maxLength: row.maxLength }),
          ...(row.as && { as: row.as }),
          ...(row.rows && { rows: row.rows }),
        }}
      >
        {row.options &&
          renderOptions(row.options, row.hasBlankOption, row.optionsAccessors)}
      </Form.Control>
      <ErrorMessage
        {...{
          className: "text-danger",
          component: "div",
          name: row.name,
        }}
      />
    </Col>
  );

  const failValidation = (value) => {
    if (!value) return true;
    return isArray(value)
      ? value.some((v) => !v.label || !v.name)
      : !value.label || !value.name;
  };

  const trimValues = (obj) =>
    Object.keys(obj).forEach((key) => (obj[key] = get(obj, key).trim()));

  const renderForm = ({
    data = [],
    doTrimValues = false,
    handleSubmit,
    onSubmitSuccess,
    yupSchema,
  }) => {
    if (isEmpty(data)) return;
    return (
      <Formik
        {...{
          initialValues: getInitialValues(data),
          ...(yupSchema && { validationSchema: yupSchema }),
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          doTrimValues && trimValues(values);
          try {
            await handleSubmit(values);
            onSubmitSuccess && onSubmitSuccess();
          } catch (err) {
            console.log(err);
            alert("Ocurrió un error.");
          }
          setSubmitting(false);
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            {data.map((row, idx) => {
              if (failValidation(row)) return null;

              const colProps = {
                errors,
                handleBlur,
                handleChange,
                touched,
                values,
              };

              return (
                <Form.Row className="mb-3" key={idx}>
                  {isArray(row)
                    ? row.map((col) => renderCol({ ...colProps, row: col }))
                    : renderCol({ ...colProps, row })}
                </Form.Row>
              );
            })}
            <Form.Row>
              <Button
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                isSubmit
              />
            </Form.Row>
          </Form>
        )}
      </Formik>
    );
  };

  return { renderForm };
};
