# App architecture decisions

*This README is not (yet) explaining all the app architecture decisions.*

## Categorization
The app lists two **groups** of items, *locations* and *products*.

All these items can be of **type** *gastronomy* or *retail*.

Depending on the combination, items are classified in a specific **category**:
- A *location* of type *gastronomy* is a **restaurant**.
- A *location* of type *retail* is a **shop**.
- A *product* of type *gastronomy* is a **meal**.
- A *product* of type *retail* is a **retail-product** (for a lack of better name).
