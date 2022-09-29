# Objectif
L'objeectif de ce projet est de refaire entièrement le front Kfet

# Table des matières
<!-- TOC -->
* [Objectif](#objectif)
* [Table des matières](#table-des-matires)
* [Cahier des Charges](#cahier-des-charges)
  * [Pouvoir Débucquer](#pouvoir-dbucquer)
  * [Pouvoir recharger](#pouvoir-recharger)
  * [Pouvoir rentrer des remises](#pouvoir-rentrer-des-remises)
  * [Pouvoir rentrer les produits](#pouvoir-rentrer-les-produits)
  * [Pouvoir gérer les fin’sss](#pouvoir-grer-les-finsss)
  * [Bucquage](#bucquage)
  * [Debucquage](#debucquage)
  * [Pouvoir se connecter](#pouvoir-se-connecter)
    * [Au pian’sss](#au-piansss)
    * [Chez soi](#chez-soi)
* [Setup](#setup)
* [Structure](#structure)
<!-- TOC -->

# Cahier des Charges
## Pouvoir Débucquer
| Fonction                                                                                                                    | importance | logique ok |
|-----------------------------------------------------------------------------------------------------------------------------|------------|------------|
| Accessible sur permission uniquement (pour les vp seulement sur les pian’ss)                                                |          5 | ~          |
| Les produits sont listés par entité                                                                                         |          5 | ~          |
| une option est disponible pour pouvoir changer d’entité si perms                                                            |          5 | ~          |
| une permission existe pour pouvoir débuquer en negat’sss                                                                    |          3 | ~          |
| Selection via scan de code barre                                                                                            |          2 |            |
| Pouvoir annuler un débuquage                                                                                                |          4 |            |

## Pouvoir recharger
| Fonction                                | importance | logique ok |
|-----------------------------------------|------------|------------|
| Accessible sur permission               |          5 | ~          |
| Pouvoir scanner un qrcode zapette       |          5 | ~          |
| Pouvoir scanner qrcode sur tel          |          2 |            |
| Pouvoir recharger par espèce avec perm  |          5 | ~          |
| pouvoir recharger par chèque avec perm  |          5 | ~          |
| pouvoir recharger manuellement lydia    |          5 | ~          |

## Pouvoir rentrer des remises
| Fonction                                                            | importance | logique ok |
|---------------------------------------------------------------------|------------|------------|
| une remise est une recharge à prix fixé débucquable avec permission |          3 |            |


## Pouvoir rentrer les produits
| Fonction                                                                | importance | logique ok |
|-------------------------------------------------------------------------|------------|------------|
| Pouvoir lier un produit à une entité                                    |          5 | ~          |
| Pouvoir assigner un stock (ou illimité) à un produit                    |          3 |            |
| le produit doit avoir un prix                                           |          5 | ~          |
| le prix doit pouvoir être calculé automatiquement (stock + coût total)  |          2 |            |
| le produit doit être nommé                                              |          5 | ~          |
| le produit doit avoir un raccourci                                      |          5 | ~          |
| Le produit doit avoir un code barre                                     |          2 |            |


## Pouvoir gérer les fin’sss
| Fonction                                             | importance | logique ok |
|------------------------------------------------------|------------|------------|
| Créer un fin’ss                                      |          3 |            |
| Ajouter les débucqueurs autorisés                    |          3 |            |
| Créer des produits reliés au fin’ss                  |          3 |            |
| Pré-bucqage par lien                                 |          5 |            |
| Le PG doit pouvoir se pre-bucquer au fin’sss         |          5 |            |
| Le PG doit pouvoir spécifier des options de bucquage |          5 |            |

## Bucquage
| Fonction                                                                   | importance | logique ok |
|----------------------------------------------------------------------------|------------|------------|
| Filtre permettant de sélectionner les PG                                   |          5 |            |
| Les PG pré-bucqués doivent pouvoir être différenciable des PG non bucqués  |          4 |            |
| Le pg doit avoir un montant minimal pour pouvoir être débucqué             |          5 |            |

## Debucquage
| Fonction                                                                 | importance | logique ok |
|--------------------------------------------------------------------------|------------|------------|
| Disponible uniquement pour les personnes ayant les perms                 |          5 |            |
| Calcul automatique du prix du fin’ss à partir du prix des appros         |          5 |            |
| Override manuel possible des prix                                        |          4 |            |
| Option de pour débucquer en negat’ss dispo pour les personnes autorisés  |          5 |            |

## Pouvoir se connecter

### Au pian’sss
| Fonction                                                                                                 | importance | logique ok |
|----------------------------------------------------------------------------------------------------------|------------|------------|
| plage horaire sur laquelle le pian’sss est connecté avec un compte VP                                    |          5 |            |
| Si un vp veut se connecter en dehors de la plage horaire, il doit le faire avec son compte               |          5 | ~          |

### Chez soi
| Fonction                                                                                                 | importance | logique ok |
|----------------------------------------------------------------------------------------------------------|------------|------------|
| Un PG doit pouvoir se connecter de chez soi.                                                             |          5 | ~          |

# Setup
- cloner le dépot
- installer les dependencies: `npm install` a la racine
- lancer le projet `npm start`
- lancer le serveur de dev niki: [doc](https://github.com/REZAL-AM-KIN/niki-s)

# Structure
Tu fait comme ce qui est montré qui a été fait
