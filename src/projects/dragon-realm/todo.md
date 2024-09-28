# TODO


- the game must fetch the game data from the database instead of the filesystem
  - admin forms:
    - area:
      - pick where the character will spawn when taking an exit
        - selection:
          - use shadcn's combobox, rename it to autocomplete
          - prototype:
            - retrieve ALL the areas from the server (only the name and _id)
            - put them into the options
            - once selected, render the interactive canvas
          - final
            - make it so the autocomplete works with
            - async data retrieval
        - interactive canvas:
          - only one exit can be added to the destination area
          - the exit must be in the same direction as the origin (vertical or horizontal)
          - the exit must snap to the borders and not go outside (**must apply to the area edition too**)
          - instead of setting a player position, only set the destination exit to target
      - must be able to save an area that has exits without a destination exit set
        - must be able to find quickly ares that have exits without a destination
      - analyze the feasibility of removing the property "id" to replace it with "_id"
      - save the whole, updated area to the DB
      - refactor the whole view
      - enemy encounters
- save the game into database; find out at which point the game data must be updated
- must calculate the player position to be in the middle of the exit towards the inside of the area; within the game
