import SvgIcon from "@mui/material/SvgIcon";
import styles from "./border-box.module.scss";
import { Box } from "@mui/material";
import { ElementType } from "react";

interface BorderBoxProps {
  icon?: ElementType;
  title?: string;
  isValid?: boolean;
  children: React.ReactNode;
}

export default function BorderBox({
  icon,
  title,
  isValid,
  children,
}: BorderBoxProps) {
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
          height: 300,
          width: 200,
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
