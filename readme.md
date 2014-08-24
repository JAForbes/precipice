LD30
====

What is Charge?
---------------

Charge is meant to be the amount of energy left in the wormhole.

If the charge is bigger the wormhole is bigger and vice versa.

Because the shield needs to be bigger than the charge, it's radius is affected by the charge value.

When you create a shield or a projectile, the charge is decremented too.

To remove the coupling of Shield to charge.  You could have a shield protector
Which is the entity that the shield is guarding.
Then we can inspect that entities arc radius and make sure we are bigger than it.

Charge could be mean how much energy something has.  Not sure if there is a difference between charge and strength 