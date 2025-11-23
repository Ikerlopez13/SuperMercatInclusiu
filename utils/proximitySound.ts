"use client";

export class ProximitySoundSystem {
  private audioContext: AudioContext | null = null;
  private currentInterval: NodeJS.Timeout | null = null;
  private isPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private beep(duration: number = 50) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  public start(distance: number) {
    if (this.isPlaying) return;

    this.isPlaying = true;
    
    // Calculate beep interval based on distance
    // Closer = faster beeps
    let interval: number;
    
    if (distance <= 1) {
      // Very close - continuous beep
      this.beep(1000);
      return;
    } else if (distance <= 3) {
      interval = 200;
    } else if (distance <= 5) {
      interval = 400;
    } else if (distance <= 8) {
      interval = 600;
    } else {
      interval = 1000;
    }

    this.beep();
    this.currentInterval = setInterval(() => {
      this.beep();
    }, interval);
  }

  public stop() {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
    this.isPlaying = false;
  }

  public update(distance: number) {
    this.stop();
    if (distance > 0 && distance <= 15) {
      this.start(distance);
    }
  }

  public destroy() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

