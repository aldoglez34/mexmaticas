import React, { memo } from "react";
import { Button } from "react-bootstrap";
import { bool, string } from "prop-types";

export const AdminSubmitButton = memo(({ isSubmitting, text = "Guardar" }) => (
  <Button
    className="shadow-sm"
    disabled={isSubmitting}
    type="submit"
    variant="dark"
  >
    {text}
  </Button>
));

AdminSubmitButton.propTypes = {
  isSubmitting: bool.isRequired,
  text: string,
};

AdminSubmitButton.displayName = "AdminSubmitButton";
