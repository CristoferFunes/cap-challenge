# Cap Challenge by Cristofer Funes

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Decision making process](#process)
- [Algorithm and approach description](#Algorithm)
- [Installation](#installation)
- [Instructions for use](#Instructions)
- [Conclusion](#conclusion)

## Introduction

In this case I chose the first element in the backlog, **The Traveling Salesman Problem**.

The first reason why I chose this one is that I wanted to show my algorithmic solving capabilities, 
also I felt comforable with using frontend tools to show the resolution in a graphic way, the second main 
reason is a bit of a personal one, since college, I always wanted to solve this problem but I never had the excuse
to do so, and I kind of always had an abstract solution inside my mind so I found this to be finally the opporunity
to give it a proper try.

## Features

- Solves the TSP using a genetic algorithm.
- It has a minimalistic UI that keeps the focus on the visualization of the problem
- The user can choose the points in the canvas by clicking the "add point" button.
- The user can delete points in the canvas, either by clicking the "delete last" button or choosing which point they want to delete by clicking the point itself.
- It has a graphic visualization of the current best result, so the user can see the progress
- Gives the user the option to randomize the current location for all the existing points
- Gives the user the option to change the parameters of the algorithm.

## Process

I was planning to give it a couple hours every weekday (the time that I had available) since the I had a little personal issue during the first days of the challenge (I got coronavirus) so I couldn't start the challenge until Monday 23th of October,
Anyway I considered the time left to be enough, I splited the task into tinier bits and my sprint planning ended up like this:

(I added some notes on the actual time it took me to complete every task)

Monday 23th of October: Create the Node project and all the React environment, the challenge required that I didn't use any library other than the framework in which I was going to deliver the challenge, so I didn't use the typical "create-react-app" approach,
instead I manually imported just the necesary dependencies in an effort to show that I can build the project from scratch and I know how the framework operates.
This task was completed on time.

Tuesday 24th: Create a basic structure of the visualization of the points and the data structure
This task was completed on time, but I needed to add a loader for the css and took me a bit more than expected

Wednesday 25th: Create a brute force algorithm to test the visualization interface and starting to get the grasp of the main problem.
This task was completed on time.

Thursday 26th: Lay down the pseudocode for my approach on a better algorithm and research for existing methods in an effort to come with an integral solution.
See the second approach at [Algorithm and approach description](#Algorithm).
This task was completed on time

Friday 27th: Implement my concluded approach into the code, see third approach at [Algorithm and approach description](#Algorithm).
This task took me longer than expected as the results were not the ones I expected and I needed to calibrate the parameters and run some tests, I used some time on Saturday and Monday.

Monday 30th: Create the input for the user defined spots and the UI elements for that.
I couldn't complete this task this day as I was finishing the algorithm.

Tuesday 31st: Write down the documentation for the project, setup the README.
I was able to catch up by this point and completed the task on time.

Wednesday 1st of November: Make sure everything is in order, prepare the package and send the results.


## Algorithm

### Data structure
-I have one canvas (1024px, 512px)
-An array of objects (in this case the points) with this parameters: an x position within the range of 0-1024, an y position within the range of 0-512, an index number for determining the order

### First approach (brute force)

I believe this is a really interesting problem because it has the potential to have the worst time complexity _O(N!)_.
Which is the case for the first approach that I implemented which followed this steps to iterate through all the posibilities in lexicographic order (ABC, ACB, BAC, BCA, CAB, CBA):
Find the largest i so that Array[i].order_index < Array[i+1].order_index;
Find the largest j so that Array[i].order_index < Array[j].order_index;
Swap Array[i] and Array[j];
Reverse Array[i+1 ... n];

I wont get into much detail for this algorithm for is not the main objective of the exercise.

### Second approach (Centrality measure)

My first guess on how to address this problem was to iterate multiple times over random posibilities, meassure their total distances and giving scores to their individual nodes.
In this case a node would be a certain point object with an extra parameter which was "importance"
For example: {x:10, y:42, order_index: 4, importance: N}.
At the end it should construct an order putting all the order indexes that had the most importance.
The downside of this approach was that it didn't took into account the fact that an array needed to have **all** the members and resulted in the repetition of nodes in a given order
For example: (2,1,2,3,2) instead of (4,2,3,1,0).
By doing some research in an effort to find different perspectives, I came across with new strategies which included a population rather than just iterating over one member and in the
end I learned a lot of genetic algorithms which complemented my original idea and became my utimate approach.

### Third approach (Evolutionary optimization)

For this my data structured evolved a little:
-The array of points {x_position, y_position, index_order}
-Population: An array of objects again, but in this case this objects contained a fitness score (I will elaborate in a moment) and an array of objects {x_position, y_position, index_order} in a given order.

This approach follows the evolutionary principle "Survival of the fittest", and to achieve this, my algorithm follows this steps:

**A) Creating a starting population**
Parameters: population size.
In this case I filled the population array with all random paths to follow (similar to the second approach).

**B) Evaluate the members of the population**
I need to determine a fitness score for all the routes in the population.
Similar to the second approach all the routes are evaluated with the sum of the total distances between points, in this case the shortest the better, to achieve a greater score with a smaller
number, I inverted it like this: 1/total_distance.
I wanted the little differences to be impactfull (a score of 0.4 should be way more important than 0.35) so I raised the value to the power of three (could have been to another value but after a couple tests
it was the one that suited better).
Also I wanted all the values to be proportional to the population so I normalized them by dividing all the values by the sum of their total.

**C) Creation of the next generation**
Parameters: mutation_rate
For this step I need to create a new population the same size as the latest, for this I followed two steps:
Crossover:
For each member of the new population, I selected two "parents" from the previous population, the selection process follows a probability function acording to their normalized fitness score from last step,
then it creates a new member, by joining the values from the route of the parents (also acording to the relative fitness value from each parent).
Mutation:
In order to give diversity to the population and preventing it to become static, some members of the new population have some of their routes changed, the selection of this members comes from a mutation rate.

**D) Repeat**
Once we have a new population, it repeats the process starting from step **B** until the population completes a determined number of cicles being 80% similar to the best route.

## Instalation

To see this algorithm in action, you need to follow this steps:
1. Clone the repository: `git clone https://github.com/CristoferFunes/cap-challenge.git`
2. Install the necessary dependencies using a package manager like npm and then run the next command:

```bash
npm install
```

3. Run the application with this command

```bash
npm start
```

Once the console shows "webpack compiled successfully".
You can see the application [HERE](http://localhost:3000/) or typing "http://localhost:3000/ on your preferred browser.

## Instructions

- The user can add points in the black area by clicking first on the "add point" button and then choosing the location with your mouse, 
you can cancel it by clicking the same button.
- To delete a determined point, just click over it (make sure the option for adding a point is not active).
- Also you can easily delete the last point by clicking the "delete last" button.
- You can delete all the existing points by clicking the "Reset all" button.
- A little feature is that you can randomize the position of all existing points by clicking on "Randomize existing".
- Once all is settled you can click the "Start test" button to watch the program run.
- if you click the "edit parameters" button you can alter the default settings for the algorithm.


##Limitations

##Conclusion


