import { Link } from 'react-router-dom';

import { useState } from 'react';

import {
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

import {
  FaQuestion,
  FaGithub,
  FaLinkedin,
} from 'react-icons/fa';

const Layout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [navHover, setNavHover] = useState(false)

  return (
    <div className="h-screen bg-hero bg-cover">
      <header
        className="fixed z-10 w-full"
        onMouseOver={() => setNavHover(true)}
        onMouseOut={() => setNavHover(false)}
      >
        <div className={`${navHover ? "translate-y-0": "-translate-y-24"} transition-all flex justify-between items-end py-6 px-16 bg-black/75 font-primary text-white font-bold`}>
          <h1 className="text-5xl">
            <Link to="/">NBA Face Off</Link>
          </h1>
          <div className="flex gap-x-8 text-xl">
            <Link to="/">New Game</Link>
          </div>
        </div>
      </header>

      <main className="h-screen overflow-scroll">
        {children}
      </main>

      <Tooltip label="About" hasArrow arrowSize={6}>
        <IconButton aria-label="open about" icon={<FaQuestion />} onClick={onOpen} borderRadius="full" pos="absolute" bottom="5" right="5"/>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <h1 className="text-3xl">NBA Face Off</h1>
            <div className="flex gap-x-2">
              <h2 className="text-base text-gray-500 font-normal">An NBA card game developed by <a href="https://dylanlau.com" target="_blank" className="underline hover:text-gray-400">Dylan Lau</a></h2>
              <div className="flex gap-x-2">
                <a href="https://github.com/dylanlauzy/nba-face-off" target="_blank" className="hover:text-gray-500 transition-all">
                  <FaGithub/>
                </a>
                <a href="https://www.linkedin.com/in/dylanzylau/" target="_blank" className="hover:text-gray-500 transition-all">
                  <FaLinkedin />
                </a>
            </div>
            </div>
          </ModalHeader>

          <hr />
          
          <ModalBody>
            <b>Overview:</b> NBA Face-Off is a web-based card game that challenges your NBA knowledge and luck. The game is played with a deck of NBA player cards, each featuring a player and their stats from the past season. The objective of the game is to win all of your opponent's cards. 
            <br/><br/>
            <b>Starting the Game:</b> Each player starts with a random collection of 12 NBA player cards. 
            <br/><br/>
            <b>Gameplay:</b> Each round, a player draws a random card from their deck and chooses one of the card's stats. They are betting that their chosen stat will be higher than the same stat on their opponent's card. 
            <br/><br/>
            <b>Winning a Round:</b> If the player's card has a higher stat than the same stat on their opponent's card, they win the round. The opponent's card is added to the winning player's deck, and the winning player gets to choose the stat for the next round. 
            <br/><br/>
            <b>Losing a Round:</b> If the player's chosen stat is lower than the same stat on their opponent's card, they lose the round. The player's card is added to the opponent's deck, and the opponent gets to choose the stat for the next round. 
            <br/><br/>
            <b>Ties:</b> In the event of a tie, both cards are added to a pile. The next round is played as normal, but the winner takes all the cards in the pile as well. 
            <br/><br/>
            <b>End of the Game:</b> The game continues until one player has won all of the cards. The player who successfully takes all of their opponent's cards is declared the winner. 
            <br/><br/>
            <b>Strategy:</b> Winning at NBA Face-Off requires a combination of NBA knowledge, strategic thinking, and a bit of luck. Knowing the strengths and weaknesses of your cards, as well as being able to guess your opponent's strategy, can give you the upper hand. But remember, the draw of the cards can always bring an unexpected twist!
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Layout