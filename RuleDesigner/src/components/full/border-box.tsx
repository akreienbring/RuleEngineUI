/*
  Author: André Kreienbring
  A custom box with a border, title and icon in the top border
*/
import { ElementType, JSX } from "react";
import SvgIcon from "@mui/material/SvgIcon";
import styles from "./border-box.module.scss";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

interface BorderBoxProps {
  icon?: ElementType;
  title?: string;
  isValid?: boolean;
  children: React.ReactNode;
  other?: object;
}

/**
 * A custom bordered box that presents title and icon in the to border.
 * @param {BorderBoxProps} props
 * @param {ElementType} [props.icon] - If given this icon will be shown in the upper border
 * @param {string} [props.title] - If given this title will be shown in the upper border
 * @param {boolean} [props.isValid] - If not given the border is grey. If true the border is green, red otherwise
 * @returns {JSX.Element}
 */
function BorderBox({
  icon,
  title,
  isValid,
  children,
  ...other
}: BorderBoxProps): JSX.Element {
  let mainContainerClass = styles.mainContainerGrey;
  let headerClass = styles.headerGrey;
  let headerBorderBeforeClass = styles.headerBorderBeforeGrey;
  let headerBorderAfterClass = styles.headerBorderAfterGrey;
  let headerTitleClass = styles.headerTitleGrey;
  let childrenContainerClass = styles.childrenContainerGrey;

  if (typeof isValid !== "undefined" && isValid === false) {
    mainContainerClass = styles.mainContainerRed;
    headerClass = styles.headerRed;
    headerBorderBeforeClass = styles.headerBorderBeforeRed;
    headerBorderAfterClass = styles.headerBorderAfterRed;
    headerTitleClass = styles.headerTitleRed;
    childrenContainerClass = styles.childrenContainerRed;
  }

  if (typeof isValid !== "undefined" && isValid === true) {
    mainContainerClass = styles.mainContainerGreen;
    headerClass = styles.headerGreen;
    headerBorderBeforeClass = styles.headerBorderBeforeGreen;
    headerBorderAfterClass = styles.headerBorderAfterGreen;
    headerTitleClass = styles.headerTitleGreen;
    childrenContainerClass = styles.childrenContainerGreen;
  }

  return (
    <Box className={mainContainerClass}>
      <Box className={headerClass}>
        <Box className={headerBorderBeforeClass}></Box>
        {(icon || title) && (
          <Box className={headerTitleClass}>
            {icon && (
              <SvgIcon component={icon} color={isValid ? "success" : "error"} />
            )}
            {title && <span className={styles.title}>{title}</span>}
          </Box>
        )}
        <Box className={headerBorderAfterClass}></Box>
      </Box>
      <Box
        className={childrenContainerClass}
        sx={{
          height: "100%",
          width: 200,
          overflow: "auto",
        }}
        {...other}
      >
        {children}
      </Box>
    </Box>
  );
}

const StyleldBorderBox = styled(BorderBox)``;
export default StyleldBorderBox;
