# App architecture decisions

*This README is not (yet) explaining all the app architecture decisions.*

## Categorization
The app lists two **groups** of items, *locations* and *products*.

All these items can be of **type** *gastronomy* or *retail*.

Depending on the combination, items are classified in a specific **category**:
- A *location* of type *gastronomy* is a **gastronomyLocation**.
- A *location* of type *retail* is a **retailLocation**.
- A *product* of type *gastronomy* is a **gastronomyProduct**.
- A *product* of type *retail* is a **retailProduct**.
