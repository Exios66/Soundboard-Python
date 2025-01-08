import os
import numpy as np
import soundfile as sf

def create_tone(frequency, duration, sample_rate=44100):
    """Create a sine wave tone."""
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    tone = np.sin(2 * np.pi * frequency * t)
    return tone

def main():
    # Create sounds directory if it doesn't exist
    sounds_dir = os.path.join(os.path.dirname(__file__), "..", "..", "sounds")
    if not os.path.exists(sounds_dir):
        os.makedirs(sounds_dir)

    # Create placeholder sounds
    sounds = {
        "sound1.wav": (440, 1),    # A4 note, 1 second
        "sound2.wav": (880, 1),    # A5 note, 1 second
        "sound3.wav": (1320, 1),   # E6 note, 1 second
        "timer-end.wav": (660, 2)  # E5 note, 2 seconds
    }

    for filename, (freq, duration) in sounds.items():
        tone = create_tone(freq, duration)
        filepath = os.path.join(sounds_dir, filename)
        sf.write(filepath, tone, 44100)
        print(f"Created {filename}")

if __name__ == "__main__":
    main() 