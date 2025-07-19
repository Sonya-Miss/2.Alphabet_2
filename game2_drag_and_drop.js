
const dragAndDropPuzzlesData = [
    { correctWord: "Jj", image: "./Pictures/Jj.jpg", draggableWord: "Jj" },
    { correctWord: "Kk", image: "./Pictures/Kk.jpg", draggableWord: "Kk" },
    { correctWord: "Ll", image: "./Pictures/Ll.jpg", draggableWord: "Ll" },
    { correctWord: "Mm", image: "./Pictures/Mm.jpg", draggableWord: "Mm" },
    { correctWord: "Nn", image: "./Pictures/Nn.jpg", draggableWord: "Nn" },
    { correctWord: "Oo", image: "./Pictures/Oo.jpg", draggableWord: "Oo" },
    { correctWord: "Pp", image: "./Pictures/Pp.jpg", draggableWord: "Pp" },
    { correctWord: "Qq", image: "./Pictures/Qq.jpg", draggableWord: "Qq" },
    { correctWord: "Rr", image: "./Pictures/Rr.jpg", draggableWord: "Rr" },
];




const dragAndDropPuzzlesData2 = [
    { correctWord: "Go", image: "./Pictures/іти.jpg", draggableWord: "Go" },
    { correctWord: "Eat", image: "./Pictures/їсти.jpg", draggableWord: "Eat" },
    { correctWord: "Drink", image: "./Pictures/пити.jpg", draggableWord: "Drink" },
    { correctWord: "Sleep", image: "./Pictures/спати.jpg", draggableWord: "Sleep" },
    { correctWord: "Play", image: "./Pictures/грати.jpg", draggableWord: "Play" },
    { correctWord: "Read", image: "./Pictures/читати.jpg", draggableWord: "Read" },
    { correctWord: "Write", image: "./Pictures/писати.jpg", draggableWord: "Write" },
    { correctWord: "Like", image: "./Pictures/подобатися.jpg", draggableWord: "Like" },
    { correctWord: "Go", image: "./Pictures/їхати.jpg", draggableWord: "Go" },
];







// --- ДОПОМІЖНІ ФУНКЦІЇ ---
/**
 * Перемішує елементи масиву випадковим чином.
 * @param {Array} array - Масив для перемішування.
 * @returns {Array} Перемішаний масив.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- КЛАС ДЛЯ ГРИ "Перетягни слово до картинки" ---
class DragAndDropImageGame {
    /**
     * Створює новий екземпляр гри "Перетягни слово до картинки".
     * @param {string} puzzlesContainerId - ID HTML-контейнера для головоломок (картинок та зон скидання).
     * @param {string} draggableWordsContainerId - ID HTML-контейнера для перетягуваних слів.
     * @param {Array<Object>} gameData - Масив даних для головоломок.
     */
    constructor(puzzlesContainerId, draggableWordsContainerId, gameData) {
        this.puzzlesContainer = document.getElementById(puzzlesContainerId);
        this.draggableWordsContainer = document.getElementById(draggableWordsContainerId);
        this.gameData = gameData;
        this.draggedItem = null; // Локальна змінна для цього екземпляра гри

        if (!this.puzzlesContainer || !this.draggableWordsContainer) {
            console.error(`Контейнери для гри не знайдено: ${puzzlesContainerId}, ${draggableWordsContainerId}`);
            return;
        }
        this.init();
    }

    init() {
        this.puzzlesContainer.innerHTML = ''; // Очищаємо контейнери перед ініціалізацією
        this.draggableWordsContainer.innerHTML = '';

        if (this.gameData.length > 0) {
            this.gameData.forEach((data, index) => {
                this.createPuzzle(data, index);
            });
            this.createDraggableWords();
        }
    }

    /**
     * Створює одну головоломку для перетягування слова до картинки.
     * @param {Object} puzzleData - Дані для конкретної головоломки.
     * @param {number} index - Індекс головоломки.
     */
    createPuzzle(puzzleData, index) {
        const puzzleId = `${this.puzzlesContainer.id}-puzzle-${index}`; // Унікальний ID
        const correctWord = puzzleData.correctWord;
        const imagePath = puzzleData.image;

        const puzzleWrapper = document.createElement('div');
        puzzleWrapper.id = puzzleId;
        // Змінені класи згідно з вашим запитом: w-55 h-70 замість w-[calc(34%-1.066rem)] min-w-[180px]
        // Проте, w-55 h-70 - це нестандартні Tailwind класи. Якщо ви використовуєте кастомну конфігурацію Tailwind,
        // вони мають бути визначені там. В іншому випадку вони не матимуть ефекту.
        // Я залишу їх, як ви просили, але зверніть увагу на це.
        puzzleWrapper.className = "bg-white p-3 rounded-lg shadow-md flex flex-col items-center relative flex-grow-0 flex-shrink-0 w-55 h-70"; 
        puzzleWrapper.innerHTML = `
            <div class="w-[200px] h-[180px] flex items-center justify-center bg-gray-100 rounded-md shadow-sm overflow-hidden mb-5"> 
                <img src="${imagePath}" alt="Зображення для слова ${correctWord}" class="max-w-full max-h-full object-contain"> 
            </div> 
            
            <div class="word-drop-zone w-full h-16 flex justify-center items-center border-2 border-dashed border-gray-300 rounded-md text-lg font-bold text-gray-500 overflow-hidden">
                <span class="placeholder text-sm">Перетягніть букву сюди</span>
            </div>
            
            <div class="mt-6 w-full">
                <button id="check-btn-${this.puzzlesContainer.id}-${index}" class="w-full h-10 bg-sky-500 text-white font-bold py-1.5 px-3 rounded-md hover:bg-sky-600 transition-colors duration-300 disabled:bg-slate-300 text-sm">
                    Перевірити
                </button>
                <p id="message-${this.puzzlesContainer.id}-${index}" class="mt-1 h-4 text-center text-xs font-medium"></p>
            </div>
        `;
        this.puzzlesContainer.appendChild(puzzleWrapper);
        const wordDropZone = puzzleWrapper.querySelector('.word-drop-zone');
        const checkBtn = document.getElementById(`check-btn-${this.puzzlesContainer.id}-${index}`);
        const messageEl = document.getElementById(`message-${this.puzzlesContainer.id}-${index}`);

        this.addWordDropZoneListeners(wordDropZone);
        checkBtn.addEventListener('click', () => this.checkWordDropResult(correctWord, wordDropZone, messageEl, checkBtn));
    }

    /** Створює та додає перетягувані слова до контейнера. */
    createDraggableWords() {
        this.draggableWordsContainer.innerHTML = '';
        const wordsToDrag = shuffleArray(this.gameData.map(p => p.draggableWord));

        wordsToDrag.forEach((word, index) => {
            const wordBox = document.createElement('div');
            wordBox.id = `draggable-word-${this.draggableWordsContainer.id}-${index}`;
            wordBox.className = 'draggable-word bg-blue-200 text-blue-800 py-3 px-6 rounded-lg shadow-md cursor-grab text-xl md:text-xl font-semibold transition-transform duration-200 hover:scale-105';
            wordBox.textContent = word;
            wordBox.draggable = true;
            this.addDraggableWordListeners(wordBox);
            this.draggableWordsContainer.appendChild(wordBox);
        });
    }

    /** Додає слухачі подій до елементів, що перетягуються (слова). */
    addDraggableWordListeners(element) {
        element.addEventListener('dragstart', (e) => {
            this.draggedItem = e.target; // Встановлюємо draggedItem для цього класу
            e.dataTransfer.setData('text/plain', element.textContent);
            setTimeout(() => {
                e.target.classList.add('opacity-50');
            }, 0);
        });

        element.addEventListener('dragend', (e) => {
            setTimeout(() => {
                if (this.draggedItem) {
                    this.draggedItem.classList.remove('opacity-50');
                }
                this.draggedItem = null; // Очищуємо draggedItem після завершення перетягування
            }, 0);
        });
    }

    /** Додає слухачі подій до зон скидання (контейнери над картинками) для слів. */
    addWordDropZoneListeners(zone) {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            // Перевіряємо draggedItem цього класу та чи це правильний тип елемента
            if (this.draggedItem && this.draggedItem.classList.contains('draggable-word') && !zone.querySelector('.draggable-word')) {
                zone.classList.add('drag-over');
            }
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');

            if (this.draggedItem && this.draggedItem.classList.contains('draggable-word') && !zone.querySelector('.draggable-word')) {
                // Повертаємо будь-яке слово, яке вже було в цій зоні, назад у контейнер для перетягування
                const existingWord = zone.querySelector('.draggable-word');
                if (existingWord) {
                    this.draggableWordsContainer.appendChild(existingWord);
                    existingWord.classList.remove('correct-word-box', 'incorrect-word-box');
                    existingWord.draggable = true;
                    existingWord.style.cursor = 'grab';
                }

                zone.appendChild(this.draggedItem);
                const placeholder = zone.querySelector('.placeholder');
                if (placeholder) {
                    placeholder.style.display = 'none';
                }

                const messageEl = zone.parentElement.querySelector(`[id^="message-${this.puzzlesContainer.id}-"]`);
                if (messageEl) {
                    messageEl.textContent = '';
                    zone.classList.remove('correct', 'incorrect');
                    if (this.draggedItem.classList.contains('correct-word-box') || this.draggedItem.classList.contains('incorrect-word-box')) {
                        this.draggedItem.classList.remove('correct-word-box', 'incorrect-word-box');
                    }
                }
                const checkBtn = zone.parentElement.querySelector(`[id^="check-btn-${this.puzzlesContainer.id}-"]`);
                if (checkBtn) {
                    checkBtn.disabled = false;
                }
            }
        });
    }

    /** Перевірка результату для гри "Перетягни слово до картинки". */
    checkWordDropResult(correctWord, wordDropZone, messageEl, checkBtn) {
        const droppedWordElement = wordDropZone.querySelector('.draggable-word');
        let userAnswer = '';

        if (!droppedWordElement) {
            messageEl.textContent = 'Будь ласка, перетягніть букву';
            messageEl.className = 'mt-1 h-4 text-center text-xs font-medium text-amber-600';
            return;
        }

        userAnswer = droppedWordElement.textContent.trim();

        if (userAnswer === correctWord) {
            messageEl.textContent = 'Чудово, правильно!';
            messageEl.className = 'mt-1 h-4 text-center text-xs font-medium text-green-600';
            checkBtn.disabled = true;
            wordDropZone.classList.add('correct');
            wordDropZone.classList.remove('incorrect');
            droppedWordElement.classList.add('correct-word-box');
            droppedWordElement.classList.remove('incorrect-word-box');
            droppedWordElement.draggable = false;
            droppedWordElement.style.cursor = 'default';
        } else {
            messageEl.textContent = 'Спробуйте ще раз';
            messageEl.className = 'mt-1 h-4 text-center text-xs font-medium text-red-600';
            wordDropZone.classList.add('incorrect');
            wordDropZone.classList.remove('correct');
            droppedWordElement.classList.add('incorrect-word-box');
            droppedWordElement.classList.remove('correct-word-box');

            setTimeout(() => {
                const placeholder = wordDropZone.querySelector('.placeholder');
                if (placeholder) {
                    placeholder.style.display = 'inline';
                } else {
                    wordDropZone.innerHTML = `<span class="placeholder text-sm">Перетягніть букву сюди</span>`;
                }

                wordDropZone.classList.remove('incorrect');
                droppedWordElement.classList.remove('incorrect-word-box', 'opacity-50');
                droppedWordElement.classList.add('bg-blue-200', 'text-blue-800', 'hover:scale-105');
                this.draggableWordsContainer.appendChild(droppedWordElement); // Важливо: повертаємо в контейнер цього класу
                droppedWordElement.draggable = true;
                droppedWordElement.style.cursor = 'grab';
            }, 1000);
        }
    }
}

// --- ІНІЦІАЛІЗАЦІЯ ІГОР ПІСЛЯ ЗАВАНТАЖЕННЯ DOM ---
document.addEventListener('DOMContentLoaded', () => {
    // Ініціалізація першої гри (Я, Ти, Він...)
    new DragAndDropImageGame(
        'puzzles-container-drag-and-drop', // ID контейнера для головоломок
        'draggable-words-container',       // ID контейнера для перетягуваних слів
        dragAndDropPuzzlesData             // Дані для гри
    );

    // Ініціалізація другої гри (Man, Woman, Boy...)
    new DragAndDropImageGame(
        'puzzles-container-drag-and-drop2', // ID контейнера для головоломок 2
        'draggable-words-container2',        // ID контейнера для перетягуваних слів 2
        dragAndDropPuzzlesData2              // Дані для гри 2
    );
});