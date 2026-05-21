# Big Text

A transparent-background full-screen text renderer.

```text
/?text=Deploying%20in%205%20minutes
```

The page intentionally sets the root, body, and stage to:

```css
background-color: rgba(0, 0, 0, 0);
margin: 0px auto;
overflow: hidden;
```

It also accepts the previous `?m=`, `?message=`, and packed `?d=` formats for compatibility.
