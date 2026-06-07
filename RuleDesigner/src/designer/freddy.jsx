/*
  Author: André Kreienbring
  Just playing around with the statfule rule engine
  TODO: How to create a statefule engine in Typescript?
*/
import { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import ObjectList from "@src/components/full/object-list";
import SimpleRuleList from "@src/components/simple/simple-rule-list";
import { createRuleEngine, StatefulRuleEngine } from "rule-engine-js";
import BorderBox from "@src/components/full/border-box";

const baseEngine = createRuleEngine();
const statefulEngine = new StatefulRuleEngine(baseEngine, {
  triggerOnEveryChange: true,
});

const freddy = {
  name: "Freddy",
  state: "sleeping",
  image: "/assets/dog_sleeping.png",
  hunger: 0,
};

/*
  Due to this issue: https://github.com/crafts69guy/rule-engine-js/issues/10
  it's currently necessary to create three rules to simulate an OR rule for a stateful rule engine.
*/
const isAwake = {
  or: [
    {
      changedTo: ["state", "awake"],
    },
  ],
};

const isHungy = {
  or: [
    {
      decreased: ["hunger"],
    },
  ],
};

const isPlaying = {
  or: [
    {
      changedFrom: ["state", "hungry"],
    },
  ],
};

// combine the rules to present a proper presentation
const combindedRules = {
  or: isAwake["or"].concat(isHungy["or"].concat(isPlaying["or"])),
};

export default function Freddy() {
  const [dog, setDog] = useState(freddy);

  /**
   * This effect runs after the first render and does the first evaluation of the rule with the sleeping Freddy.
   * Then it runs everytime when the dog object was changed. Further evaluations trigger the rule, which can be
   * used to set for example hunger.
   */
  useEffect(() => {
    statefulEngine.evaluate("awake-freddy", isAwake, dog);
    statefulEngine.evaluate("feed-freddy", isHungy, dog);
    statefulEngine.evaluate("play-freddy", isPlaying, dog);
  }, [dog]);

  /*
    By heaving two useEffects, we can ensure that the stateful engine is destroyed when the component is unmounted. 
    Otherwise, we would have a memory leak, because the engine would still be running in the background and listening for changes on the dog object.
  */
  useEffect(() => {
    return () => {
      //console.log("destroying stateful engine");
      statefulEngine.destroy();
    };
  }, []);

  /*
    Register an event handler. If one of the rules is triggered,
    it will set the proper image of Fredy
  */
  statefulEngine.on("triggered", (event) => {
    //console.log(`Rule ${event.ruleId} was triggered!`);
    //console.log("Previous state:", event.previousState);
    //console.log("Current state:", event.currentState);
    const newDog = { ...event.context };
    if (newDog.state === "awake") {
      newDog.image = "/assets/dog_awake.png";
    } else if (newDog.state === "hungry") {
      newDog.image = "/assets/dog_eating.png";
    } else if (newDog.state === "playing") {
      newDog.image = "/assets/dog_playing.png";
    }
    setDog(newDog);
  });

  /**
   * Handles the button click with the state information.
   * If state or hunger are changed on the dog, the useEffect is
   * run to eveluate the rules again.
   * @param {string} state - The current state of the dog
   */
  const handleDog = (state) => {
    const newDog = { ...dog };

    if (state === "sleeping") {
      //clicked: Awake
      newDog.state = "awake";
      newDog.hunger = 1;
      setDog(newDog);
    } else if (state === "awake") {
      //clicked: Feed
      newDog.state = "hungry";
      newDog.hunger = 0;
      setDog(newDog);
    } else if (state === "hungry") {
      //clidked Play with
      newDog.state = "playing";
      setDog(newDog);
    } else if (state === "playing") {
      //clidked Repeat: reset the dog
      setDog({
        name: "Freddy",
        state: "sleeping",
        image: "/public/assets/dog_sleeping.png",
        hunger: 0,
      });
    }
  };

  return (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia image={dog.image} sx={{ height: 140, width: 345 }} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {dog.name}
          </Typography>
          {dog.state === "sleeping" && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {`This is ${dog.name}! He's currently ${dog.state}. His life follows a simple rule. Wake him up to see how he reacts.`}
            </Typography>
          )}
          {dog.state === "awake" && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {`Now ${dog.name} is hungry!`}
            </Typography>
          )}
          {dog.state === "hungry" && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {`Now ${dog.name} wants to play with you!`}
            </Typography>
          )}
          {dog.state === "playing" && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {`What a funny, handsome dog is ${dog.name}! Want to see this again?`}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => handleDog(dog.state)}>
            {dog.state === "sleeping"
              ? `Wake up ${dog.name}`
              : dog.state === "awake"
                ? `Feed ${dog.name}`
                : dog.state === "hungry"
                  ? `Play with ${dog.name}`
                  : "Repeat"}
          </Button>
        </CardActions>
      </Card>

      <BorderBox title={`${dog.name}`} sx={{ minWidth: 345, pl: 3 }}>
        <ObjectList obj={dog} />
      </BorderBox>

      <BorderBox title="Statful Rule" sx={{ minWidth: 345, pl: 3 }}>
        <SimpleRuleList topRule={combindedRules} topOperator="or" />
      </BorderBox>
    </Stack>
  );
}
