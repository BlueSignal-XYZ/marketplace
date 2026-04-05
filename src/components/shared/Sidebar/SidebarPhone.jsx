import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { FaBars, FaX } from "react-icons/fa6";
import styled, { keyframes } from "styled-components";
import LogoWhite from "../../../assets/logo.png";
import SidebarContent from "./SidebarContent";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
  

`;

const DialogClose = styled(Dialog.Close)`
  background: transparent;
  color: ${({ theme }) => theme.colors.ui800};
  font-size: 12px;
  height: 40px;
  width: 40px;
  border: 1px solid ${({ theme }) => theme.colors.ui200};
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const StyledSidebarPhone = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 90%;
  margin: 0 auto;
  width: 100%;
  padding: 24px 0px;
  .logo {
    width: 120px;
  }

  .dialog-trigger {
    button {
      backgorund: none;
    }
  }

  @media (min-width: 1200px) {
    display: none;
  }
`;

const StyledDialogOverlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  background-color: rgba(0, 0, 0, 0.5); /* Add background color */
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const StyledDialogContent = styled(Dialog.Content)`
  background-color: white;
  border-radius: 6px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  max-height: 85vh;
  padding: 16px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;

  .dialog-close-wrap {
    display: flex;
    justify-content: flex-end;
    button {
      padding: 16px 0px;
    }
  }
`;

function SidebarPhone() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <StyledSidebarPhone>
      <div>
        <img className="logo" src={LogoWhite} />
      </div>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger className="dialog-trigger" asChild>
          <FaBars />
        </Dialog.Trigger>
        <Dialog.Portal>
          <StyledDialogOverlay />
          <StyledDialogContent>
            <div className="dialog-close-wrap">
              <div>
                <DialogClose>
                  <FaX />
                </DialogClose>
              </div>
            </div>
            <SidebarContent />
          </StyledDialogContent>
        </Dialog.Portal>
      </Dialog.Root>
    </StyledSidebarPhone>
  );
}

export default SidebarPhone;
