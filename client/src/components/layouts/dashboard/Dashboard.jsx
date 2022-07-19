import React, { memo } from "react";
import {
  arrayOf,
  bool,
  elementType,
  func,
  node,
  object,
  oneOf,
  shape,
  string,
} from "prop-types";
import { LeftNav, ScrollButton, TopNav } from "../components";
import { Col, Container, Row } from "react-bootstrap";
import { oneOfType } from "prop-types";

export const Dashboard = memo(
  ({
    backBttn,
    buttons,
    children,
    expanded = false,
    hasScrollToTopButton = false,
    leftBarActive,
    navItems = [],
    onLogoutCallback,
    optionsDropdown,
    topNavTitle,
    type,
    userName,
  }) => (
    <div className="d-flex h-100">
      <LeftNav
        {...{
          leftBarActive,
          navItems,
          onLogoutCallback,
          type,
          userName,
        }}
      />
      <div style={{ marginLeft: "15rem" }} className="h-100 w-100">
        <TopNav
          {...{
            backBttn,
            buttons,
            optionsDropdown,
            topNavTitle,
          }}
        />
        <div style={{ padding: "35px 28px" }}>
          <Container fluid>
            {expanded ? (
              children
            ) : (
              <Row>
                <Col md={{ offset: 2, span: 8 }}>{children}</Col>
              </Row>
            )}
          </Container>
        </div>
      </div>
      {hasScrollToTopButton && (
        <ScrollButton scrollStepInPx={150} delayInMs={16.66} />
      )}
    </div>
  )
);

const optionsDropdownType = shape({
  text: string,
  href: string,
  fn: func,
  modal: shape({
    Content: elementType,
    props: object,
    size: oneOf(["sm", "md", "lg", "xl"]),
    title: string,
  }),
});

export const DashboardType = {
  backBttn: string,
  buttons: node,
  children: node.isRequired,
  expanded: bool,
  hasScrollToTopButton: bool,
  leftBarActive: string.isRequired,
  navItems: arrayOf(
    shape({
      hasPendingMessages: bool,
      icon: string,
      label: string,
      link: string,
    })
  ),
  onLogoutCallback: func,
  optionsDropdown: arrayOf(oneOfType([optionsDropdownType, string])),
  topNavTitle: string,
  type: string,
  userName: string,
};

Dashboard.propTypes = DashboardType;

Dashboard.displayName = "Dashboard";
