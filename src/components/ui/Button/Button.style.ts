import { Button, ButtonProps } from '@chakra-ui/react';
import styled, { css } from 'styled-components';

export const StyledButton = styled(Button)<ButtonProps>`
    width: 200px;
    height: 40px;
    color: #ffffff;
    background-color: #D00039;
    border-radius: 20px;
    border: 1px solid #000000;
    font-family: Georgia;
    font-style: italic;
    font-weight: bold;

    ${(props) => 
        props.variant === 'outline' && css`
        color: #000000;
        background-color: #FFFFFF;
        border: 1px solid #E1E8F1;
        font-style: normal;
        font-weight: normal;
        `
    }
`
