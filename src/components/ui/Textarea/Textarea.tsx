import { TextareaProps } from "@chakra-ui/react";

import { StyledTextarea } from "./Textarea.style";

export const Textarea = (props: TextareaProps) => {
  return <StyledTextarea {...props} />;
};
