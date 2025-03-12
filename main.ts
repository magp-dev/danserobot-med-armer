/**
 * Bit:Bot Pro Dancing Robot with Microphone Beat Detection and Position Correction
 * 
 * Uses MakeCode Bit:Bot extension (for Bit:Bot Classic/Pro).
 */
function danceStep () {
    // Randomly choose a dance move
    moveType = Math.randomRange(0, 2)
    bitbot.bbSetServo(ARM_LEFT_SERVO, leftArmCenter + SWING_ANGLE);
bitbot.bbSetServo(ARM_RIGHT_SERVO, rightArmCenter - SWING_ANGLE);
basic.pause(DANCE_DURATION / 4)
    bitbot.bbSetServo(ARM_LEFT_SERVO, leftArmCenter - SWING_ANGLE);
bitbot.bbSetServo(ARM_RIGHT_SERVO, rightArmCenter + SWING_ANGLE);
basic.pause(DANCE_DURATION / 4)
    // Perform the chosen move
    // No rotation tracking needed for forward/backward
    if (moveType == 0) {
        // Forward/Backward
        if (movementCounter % 2 == 0) {
            bitbot.motor(BBMotor.Both, MOVE_SPEED)
            basic.pause(DANCE_DURATION / 2)
            bitbot.stop(BBStopMode.Brake)
        } else {
            bitbot.motor(BBMotor.Both, 0 - MOVE_SPEED)
            basic.pause(DANCE_DURATION / 2)
            bitbot.stop(BBStopMode.Brake)
        }
    } else if (moveType == 1) {
        // Rotate Left
        bitbot.motor(BBMotor.Left, 0 - ROTATE_SPEED)
        bitbot.motor(BBMotor.Right, ROTATE_SPEED)
        basic.pause(DANCE_DURATION / 2)
        bitbot.stop(BBStopMode.Brake)
        // Track rotation (negative for left)
        accumulatedRotation += 0 - DANCE_DURATION / 2
    } else {
        // Rotate Right
        bitbot.motor(BBMotor.Left, ROTATE_SPEED)
        bitbot.motor(BBMotor.Right, 0 - ROTATE_SPEED)
        basic.pause(DANCE_DURATION / 2)
        bitbot.stop(BBStopMode.Brake)
        // Track rotation (positive for right)
        accumulatedRotation += DANCE_DURATION / 2
    }
    movementCounter += 1
    // Corrective Rotation (if needed)
    if (Math.abs(accumulatedRotation) > DANCE_DURATION) {
        correctionTime = Math.abs(accumulatedRotation) * ROTATION_CORRECTION_FACTOR
        if (accumulatedRotation > 0) {
            // Correct for rightward drift
            bitbot.motor(BBMotor.Left, 0 - ROTATE_SPEED)
            bitbot.motor(BBMotor.Right, ROTATE_SPEED)
            basic.pause(correctionTime)
            bitbot.stop(BBStopMode.Brake)
        } else {
            // Correct for leftward drift
            bitbot.motor(BBMotor.Left, ROTATE_SPEED)
            bitbot.motor(BBMotor.Right, 0 - ROTATE_SPEED)
            basic.pause(correctionTime)
            bitbot.stop(BBStopMode.Brake)
        }
        // Reset after correction
        accumulatedRotation = 0
    }
    bitbot.bbSetServo(ARM_LEFT_SERVO, leftArmCenter);
bitbot.bbSetServo(ARM_RIGHT_SERVO, rightArmCenter);
basic.pause(SHORT_DELAY)
}
let isDancing = false
let beatDetected = false
let lastSoundLevel = 0
let correctionTime = 0
let accumulatedRotation = 0
let movementCounter = 0
let moveType = 0
let ROTATION_CORRECTION_FACTOR = 0
let SHORT_DELAY = 0
let DANCE_DURATION = 0
let ROTATE_SPEED = 0
let MOVE_SPEED = 0
// Configuration Constants
let SWING_ANGLE = 90
MOVE_SPEED = 40
ROTATE_SPEED = 40
let SOUND_THRESHOLD = 80
DANCE_DURATION = 500
SHORT_DELAY = 50
let ARM_LEFT_SERVO = 1
let ARM_RIGHT_SERVO = 2
// Adjust this (0.8 - 1.0)
ROTATION_CORRECTION_FACTOR = 0.95
// Global Variables
let leftArmCenter = 90
let rightArmCenter = 90
bitbot.bbSetServo(ARM_LEFT_SERVO, leftArmCenter);
bitbot.bbSetServo(ARM_RIGHT_SERVO, rightArmCenter);
basic.pause(500)
// Optional: Display sound level
basic.forever(function () {
    led.plotBarGraph(
    lastSoundLevel,
    255
    )
})
// Main Loop
basic.forever(function () {
    lastSoundLevel = input.soundLevel()
    if (lastSoundLevel > SOUND_THRESHOLD) {
        if (!(beatDetected)) {
            beatDetected = true
            if (!(isDancing)) {
                isDancing = true
                danceStep()
                isDancing = false
            }
        }
    } else {
        beatDetected = false
    }
    basic.pause(20)
})
