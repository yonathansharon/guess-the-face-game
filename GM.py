import random

class Game:
    def __init__(self, image_url, correct_name, puzzle_rows=4, puzzle_cols=4, max_attempts=10):
        self.image_url = image_url
        self.correct_name = correct_name.lower()
        self.puzzle_rows = puzzle_rows
        self.puzzle_cols = puzzle_cols
        self.max_attempts = max_attempts
        self.attempts_left = max_attempts
        self.revealed_tiles = 0
        self.revealed_letters = ['_' if char.isalpha() else char for char in correct_name]
        self.incorrect_guesses = 0
        self.game_over = False
        self.won = False

    def make_guess(self, guess):
        if self.game_over:
            return "Game over."

        guess = guess.lower().strip()
        self.attempts_left -= 1
        self.incorrect_guesses += 1

        if guess == self.correct_name:
            self.won = True
            self.game_over = True
            return "Correct!"

        self.reveal_tile()
        if self.incorrect_guesses % 2 == 0:
            self.reveal_letter()

        if self.attempts_left == 0:
            self.game_over = True
            return f"Out of attempts! The correct name was {self.correct_name}."

        return self.get_game_state()

    def reveal_tile(self):
        total_tiles = self.puzzle_rows * self.puzzle_cols
        if self.revealed_tiles < total_tiles:
            self.revealed_tiles += 1

    def reveal_letter(self):
        letter_indices = [i for i, char in enumerate(self.correct_name) if char.isalpha() and self.revealed_letters[i] == '_']
        if letter_indices:
            index_to_reveal = letter_indices[0]
            self.revealed_letters[index_to_reveal] = self.correct_name[index_to_reveal]

    def get_game_state(self):
        return {
            "revealed_tiles": self.revealed_tiles,
            "name_puzzle": "".join(self.revealed_letters),
            "attempts_left": self.attempts_left
        }

# Example usage (in a back-end context):
# game = Game("image.jpg", "Albert Einstein")
# print(game.make_guess("wrong"))
# print(game.make_guess("another wrong"))
# print(game.get_game_state())