import { FaRedo } from "react-icons/fa"
import { Button } from "@chakra-ui/react"

const RematchButton = ({ loading, gameState, user }) => {
  const rematchClicked = () => {
    
  }

  return (
    <Button 
      leftIcon={<FaRedo />}
      isLoading={loading}
      loadingText="Waiting for opponent"
      variant="solid"
      onClick={rematchClicked}
    >
      Rematch
    </Button>
  )
}

export default RematchButton