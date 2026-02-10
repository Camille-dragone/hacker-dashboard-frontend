 🧠 Hacker Control Center
*Dashboard de supervision cyber — projet personnel*

---

👋 Présentation

Hacker Control Center est un projet personnel que j’ai réalisé pour aller au-delà d’un simple CRUD ou d’un site web classique.  
J’ai voulu concevoir une interface immersive, inspirée des centres de contrôle cyber que l’on voit dans les films, afin de rendre visuels et compréhensibles des concepts liés à la sécurité informatique.

Ce projet est entièrement fictif et a une vocation :
- pédagogique  
- démonstrative  
- esthétique  

Aucune action réelle de hacking n’est effectuée.

---

🎯 Concept du projet

Le site représente un centre de supervision cyber simulé :
- des entreprises fictives sont surveillées
- leur état de sécurité est affiché
- un terminal raconte les événements en temps réel
- des statistiques globales permettent une vue d’ensemble

L’objectif est qu’une personne extérieure au projet comprenne en quelques secondes :
- ce qui est surveillé
- ce qui pose problème
- ce qui est sécurisé

---

🏷️ États des cibles

Chaque entreprise possède un statut de sécurité, volontairement simplifié pour rester clair et lisible.

🔍 En analyse
La cible est en cours d’observation.
- phase de reconnaissance simulée
- collecte d’informations non intrusive
- aucune donnée sensible affichée

C’est l’état par défaut d’une entreprise.

---

🔒 Sécurisée
La cible est considérée comme correctement protégée.
- aucune vulnérabilité exploitable détectée (dans la simulation)
- risque faible
- simple surveillance

Cet état permet de montrer qu’un système peut être suivi sans être menacé.

---

⚠️ Compromise
La cible est considérée comme affectée dans le cadre du scénario fictif.
- une vulnérabilité simulée a été exploitée
- des événements critiques sont générés
- plus d’informations deviennent visibles

Cet état sert surtout à illustrer les conséquences d’une faille et à donner du sens aux logs.

---

🖥️ Fonctionnalités principales

🏢 Gestion des entreprises
- liste d’entreprises fictives
- statuts dynamiques
- niveau de vulnérabilité simulé
- affichage conditionnel selon l’état de la cible

---

🧪 Terminal simulé
- terminal animé avec effet “typing”
- logs générés dynamiquement
- horodatage précis
- messages typés (info / succès / erreur)

Le terminal est pensé comme un outil narratif, pas seulement décoratif.

---

📊 Statistiques globales
- répartition des statuts
- graphiques dynamiques
- couleurs cohérentes avec le reste de l’interface
- cartes alignées pour une UI homogène

---

 🎨 Direction artistique

Le projet adopte volontairement une esthétique :
- dark / cyber
- typographie monospace
- ambiance hacker
- animations légères pour renforcer l’immersion

L’accent est mis sur la lisibilité, même pour un public non technique.

---

🧱 Stack technique

Frontend
- React
- TypeScript
- Tailwind CSS
- composants modulaires
- gestion fine des états et des animations

Backend
- FastAPI (Python)
- base de données SQLite
- CRUD complet
- endpoints de statistiques
- génération de données fictives

