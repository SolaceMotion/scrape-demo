const express = require('express');
const api = require('./scraper');
const { getData } = api;
const router = express.Router();

router.get('/', async (req, res) => {
  const parties = await getData();
  const key = Object.keys(req.query)[0]?.toLowerCase() ?? {}; //Dynamic key
  const value = Object.values(req.query)[0]?.toLowerCase() ?? {}; //Dynamic value

  if (Object.keys(req.query).length === 0) {
    return res.json(parties);
  }
  // Filter result with key. should key be a string, perform string formatting, otherwise the type will always be number
  const arr = parties.filter(payload =>
    typeof payload[key] === 'string'
      ? payload[key]?.toLowerCase().startsWith(value)
      : payload[key]?.toString().startsWith(value)
  );

  // See if entered key exists in parties object, throw an error should it not.
  if (key in parties[0]) {
    res.json(arr);
  } else {
    res.status(400).json({ message: 'Key is invalid' });
  }
});

module.exports = router;
