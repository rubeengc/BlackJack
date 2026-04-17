import React, { useState, useEffect } from 'react';
import './Blackjack.css';

let cardCounter = 0;

const Blackjack = () => {
    const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const fullDeckNames = suits.flatMap(suit => ranks.map(rank => `card${suit}${rank}`));

    const getCardValue = (cardName) => {
        if (cardName.endsWith('J') || cardName.endsWith('Q') || cardName.endsWith('K') || cardName.endsWith('10')) return 10;
        if (cardName.endsWith('A')) return 1;
        const match = cardName.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    };

    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [deck, setDeck] = useState([]);
    const [gameMessage, setGameMessage] = useState('');
    const [isGameActive, setIsGameActive] = useState(false);
    
    const [credits, setCredits] = useState(1000);
    const [bet, setBet] = useState(0);
    const [isBettingPhase, setIsBettingPhase] = useState(true);

    const shuffle = () => [...fullDeckNames].sort(() => Math.random() - 0.5);

    // NUEVO: Añadimos isHidden a las propiedades de la carta
    const drawCard = (currentDeck, isHidden = false) => {
        const tempDeck = [...currentDeck];
        const cardName = tempDeck.pop();
        cardCounter++;
        let imgSrc = '';
        try { imgSrc = require(`../img/${cardName}.png`); } catch (err) { }
        return { id: `c-${cardCounter}`, name: cardName, value: getCardValue(cardName), imgSrc, isNew: true, isHidden };
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setPlayerHand(prev => prev.map(c => ({ ...c, isNew: false })));
            setDealerHand(prev => prev.map(c => ({ ...c, isNew: false })));
        }, 50);
        return () => clearTimeout(timer);
    }, [playerHand.length, dealerHand.length]);

    const calculateTotal = (hand) => {
        let total = hand.reduce((acc, card) => acc + card.value, 0);
        const hasAce = hand.some(card => card.name.endsWith('A'));
        if (hasAce && total + 10 <= 21) total += 10;
        return total;
    };

    const placeBet = (amount) => {
        if (credits >= amount) {
            setBet(prev => prev + amount);
            setCredits(prev => prev - amount);
        }
    };

    const deal = () => {
        if (bet === 0) return;
        setIsBettingPhase(false);
        setIsGameActive(true);
        setGameMessage('');
        const newDeck = shuffle();
        
        //Repartes al jugador 2 cartas, el crupier recibe 2 (la primera oculta)
        const p1 = drawCard(newDeck); newDeck.pop();
        const d1 = drawCard(newDeck, true); newDeck.pop(); // ¡CARTA OCULTA!
        const p2 = drawCard(newDeck); newDeck.pop();
        const d2 = drawCard(newDeck); newDeck.pop();
        
        setPlayerHand([p1, p2]);
        setDealerHand([d1, d2]);
        setDeck(newDeck);

        if (calculateTotal([p1, p2]) === 21) {
            // Si el jugador tiene Blackjack, revelamos la del crupier y resolvemos
            d1.isHidden = false;
            setDealerHand([d1, d2]);
            setTimeout(() => resolveGame([p1, p2], [d1, d2], true), 800);
        }
    };

    const hit = () => {
        if (!isGameActive || gameMessage) return;
        const nextCard = drawCard(deck);
        const newDeck = [...deck]; newDeck.pop();
        const newHand = [...playerHand, nextCard];
        setPlayerHand(newHand);
        setDeck(newDeck);
        if (calculateTotal(newHand) > 21) {
            // Revelar carta del crupier si el jugador se pasa
            let dHand = [...dealerHand];
            dHand[0].isHidden = false;
            setDealerHand(dHand);
            setGameMessage('BUST! PIERDES');
            setIsGameActive(false);
            setBet(0);
        }
    };

    const resolveGame = (pHand, dHand, isNaturalBlackjack = false) => {
        setIsGameActive(false);
        const pT = calculateTotal(pHand);
        const dT = calculateTotal(dHand);

        let message = '';
        let multiplier = 0;

        if (isNaturalBlackjack) {
            if (dT === 21) { message = 'EMPATE DE BLACKJACKS'; multiplier = 1; }
            else { message = '¡BLACKJACK! (Paga 3:2)'; multiplier = 2.5; }
        } else if (pT > 21) {
            message = 'PIERDES'; multiplier = 0;
        } else if (dT > 21 || pT > dT) {
            message = '¡GANAS!'; multiplier = 2;
        } else if (pT < dT) {
            message = 'GANA EL CRUPIER'; multiplier = 0;
        } else {
            message = 'EMPATE (PUSH)'; multiplier = 1;
        }

        setGameMessage(message);
        setCredits(prev => prev + Math.floor(bet * multiplier));
        if (multiplier === 0) setBet(0);
    };

    const stand = () => {
        if (!isGameActive || gameMessage) return;
        
        // REVELAR LA CARTA OCULTA
        let dHand = [...dealerHand];
        dHand[0].isHidden = false;
        setDealerHand([...dHand]); // Forzamos el renderizado para que inicie la animación
        setIsGameActive(false); // Bloqueamos botones mientras el crupier juega

        // DARLE TIEMPO A LA ANIMACIÓN ANTES DE PEDIR MÁS CARTAS
        setTimeout(() => {
            let currentDeck = [...deck];
            while (calculateTotal(dHand) < 17) {
                dHand.push(drawCard(currentDeck));
                currentDeck.pop();
            }
            setDealerHand([...dHand]);
            setDeck(currentDeck);
            setTimeout(() => resolveGame(playerHand, dHand), 800);
        }, 800); // Esperamos 800ms a que termine de girar la carta
    };

    const nextRound = () => {
        setPlayerHand([]);
        setDealerHand([]);
        setGameMessage('');
        setBet(0);
        setIsBettingPhase(true);
        setIsGameActive(false);
    };

    // Calculamos qué puntuación del crupier puede ver el jugador
    const visibleDealerScore = dealerHand.some(c => c.isHidden) 
        ? calculateTotal(dealerHand.filter(c => !c.isHidden)) 
        : calculateTotal(dealerHand);

    return (
        <div className='body'>
            <div className="deck-stack"></div>
            
            <div className="stats-panel">
                <div className="stat-item">SALDO: <span>${credits}</span></div>
                <div className="stat-item">APUESTA: <span>${bet}</span></div>
            </div>

            {isBettingPhase && (
                <div className="betting-overlay">
                    <h2>HAGAN SUS APUESTAS</h2>
                    <div className="chips">
                        <div className="chip chip-5" onClick={() => placeBet(5)}>5</div>
                        <div className="chip chip-25" onClick={() => placeBet(25)}>25</div>
                        <div className="chip chip-100" onClick={() => placeBet(100)}>100</div>
                    </div>
                    <button id="btn-deal" onClick={deal} disabled={bet === 0}>Repartir</button>
                    <button id="btn-clear" onClick={() => {setCredits(credits + bet); setBet(0)}}>Limpiar</button>
                </div>
            )}

            {gameMessage && (
                <div className="game-status">
                    {gameMessage}
                    <button className="btn-next" onClick={nextRound}>Nueva Ronda</button>
                </div>
            )}

            {/*Mostramos solo la puntuación visible */}
            <div id="dealer-hand-value">Crupier: {visibleDealerScore}</div>
            <div id="dealer-hand">
                {dealerHand.map(card => (
                    <div key={card.id} className={`card ${card.isNew ? 'dealing' : ''}`}>
                        {/*Contenedor 3D para el giro */}
                        <div className={`card-inner ${card.isHidden ? 'hidden' : ''}`}>
                            <div className="card-front" style={{ backgroundImage: `url('${card.imgSrc}')` }}></div>
                            <div className="card-back"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div id="player-hand">
                {playerHand.map(card => (
                    <div key={card.id} className={`card ${card.isNew ? 'dealing' : ''}`}>
                        <div className="card-inner">
                            <div className="card-front" style={{ backgroundImage: `url('${card.imgSrc}')` }}></div>
                            <div className="card-back"></div>
                        </div>
                    </div>
                ))}
            </div>
            <div id="player-hand-value">Jugador: {calculateTotal(playerHand)}</div>

            <div className="action-buttons">
                <button id="pedir" onClick={hit} disabled={!isGameActive || !!gameMessage}>Pedir</button>
                <button id="plantarse" onClick={stand} disabled={!isGameActive || !!gameMessage}>Plantarse</button>
            </div>
        </div>
    );
};

export default Blackjack;