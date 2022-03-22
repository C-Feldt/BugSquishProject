
Author: Calvin W Feldt
Start Date: 14 January 2022
Last Edit: 22 March 2022

Title: Bug Squish Project (The Invasion of the Fronks)

Description: This is a simple game in which the player squishes little space invaders named "Fronks."
  The goal is for the user to click (squish) as many Fronks as possible. An 1800 frame timer is in
  place, which is represented as 30 seconds. The game ends after the timer's countdown ends,
  showing the user their score.

Purpose: LSU Spring 2022 CSC2463 'Bug Squish' Assignment

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Bugs:	* If Fronks spawn in the same spot as the mouse initially clicks prior to starting the game, the Fronk may freeze
	  on the death frame for the entirety of the game.
	* If two Fronks are squished at once, the console throws an error for loading the same audio file simultaneously.
	  This has no effect on gameplay and is only visible via the console itself.
	* End-game victory music will ONLY play if the player has not advanced the music BPM. (Music tempo advances
	  with every click after 10 seconds have elapsed.)