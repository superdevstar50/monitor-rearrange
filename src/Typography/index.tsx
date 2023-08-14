import { Typography as MuiTypography, TypographyProps } from "@mui/material";
import { SxProps } from "@mui/system";
import React, { FC, ReactElement, ReactNode } from "react";

interface ITypographyProps extends TypographyProps {
  testid?: string;
  component?: React.ElementType;
}

/**
 * Typography
 *
 * @param {TypographyProps} props - the component props
 * @param {string} props.align - the align type
 * @param {string} props.classes - classes
 * @param {React.ElementType<any>} props.component - the component used for rendering
 * @param {boolean} props.gutterBottom - if true the text will have a bottom marginm
 * @param {boolean} props.noWrap - if true the text will not wrap
 * @param {boolean} props.paragraph - if true the text will have a paragraph element
 * @param {SxProps} props.sx - css style props
 * @param {string} props.variant - the button variant
 * @param {string} props.className - custom classname
 * @param {ReactNode} props.children - the wrapped child node
 * @param {string} props.testid - testid for tests
 * @returns {ReactElement} the Typography component
 */
const Typography: FC<ITypographyProps> = ({
  align,
  classes,
  component,
  gutterBottom,
  noWrap,
  paragraph,
  sx = {},
  variant,
  className = "",
  children,
  role,
  testid = "",
}) => {
  return (
    <MuiTypography
      {...{
        align,
        classes,
        component,
        gutterBottom,
        noWrap,
        paragraph,
        sx,
        variant,
        className,
        role,
      }}
      data-testid={testid}
    >
      {children}
    </MuiTypography>
  );
};

export default Typography;
