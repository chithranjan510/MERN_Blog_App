import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

const DeleteAlertModal = ({
  onClose,
  isOpen,
  onClick,
  description,
}: {
  onClose: () => void;
  onClick: () => void;
  isOpen: boolean;
  description: string;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody pt={10} pb={5}>
          <Text fontWeight={500}>{description}</Text>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button size="sm" colorScheme="red" onClick={onClick}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteAlertModal;
