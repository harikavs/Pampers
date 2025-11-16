import { CampaignSpec, JourneyBlueprint, MultiLanguageMessages, ChannelMessage } from "./types";

export const generateMessages = async (
  spec: CampaignSpec,
  journey: JourneyBlueprint
): Promise<MultiLanguageMessages> => {
  const isRAF = spec.campaign_name.startsWith("RAF_");
  const isPromotional = spec.campaign_type === "promotional";
  
  // Get all message keys from journey steps
  const messageKeys = journey.steps.map(step => step.message_key);
  const uniqueMessageKeys = [...new Set(messageKeys)];

  // Generate messages for all languages in spec
  const result: MultiLanguageMessages = {};

  for (const lang of spec.languages) {
    result[lang] = {};

    for (const messageKey of uniqueMessageKeys) {
      // Determine message content based on campaign type and message key
      const isNewYear = spec.campaign_name.startsWith("NEW_YEAR");
      const isXmas = spec.campaign_name.startsWith("XMAS");
      
      if (isRAF || (isPromotional && messageKey.startsWith("raf_"))) {
        // RAF-style messages
        if (messageKey === "raf_day1_push") {
          if (lang === "de") {
            result[lang][messageKey] = { title: "Freund:in einladen, Pampers Cash sichern", body: "Empfiehl Pampers Club. Wenn eine Freund:in beitritt und zum ersten Mal scannt, erhaltet ihr beide eine Belohnung." };
          } else if (lang === "es") {
            result[lang][messageKey] = { title: "Invita a un amigo, gana Pampers Cash", body: "Comparte tu amor por Pampers Club. Cuando un amigo se une y escanea su primer paquete, ambos ganan recompensas." };
          } else if (lang === "fr") {
            result[lang][messageKey] = { title: "Invitez un ami, gagnez Pampers Cash", body: "Partagez votre amour pour Pampers Club. Quand un ami rejoint et scanne son premier paquet, vous gagnez tous les deux des récompenses." };
          } else {
            result[lang][messageKey] = { title: "Invite a friend, earn Pampers Cash", body: "Share your love for Pampers Club. When a friend joins and scans their first pack, you both earn rewards." };
          }
        } else if (messageKey === "raf_day1_inbox") {
          if (lang === "de") {
            result[lang][messageKey] = { title: "Mit Empfehlungen verdienen", body: "Lade Freund:innen ein, Pampers Club beizutreten und verdiene gemeinsam Pampers Cash. Jede Empfehlung zählt!" };
          } else if (lang === "es") {
            result[lang][messageKey] = { title: "Empieza a ganar con recomendaciones", body: "Invita a amigos a unirse a Pampers Club y gana Pampers Cash juntos. ¡Cada recomendación cuenta!" };
          } else if (lang === "fr") {
            result[lang][messageKey] = { title: "Commencez à gagner avec des recommandations", body: "Invitez des amis à rejoindre Pampers Club et gagnez Pampers Cash ensemble. Chaque recommandation compte !" };
          } else {
            result[lang][messageKey] = { title: "Start earning with referrals", body: "Invite friends to join Pampers Club and earn Pampers Cash together. Every referral counts!" };
          }
        } else if (messageKey === "raf_day14_push") {
          if (lang === "de") {
            result[lang][messageKey] = { title: "Noch Zeit, Freund:innen zu empfehlen", body: "Du kannst immer noch Belohnungen verdienen, indem du Freund:innen zu Pampers Club einlädst. Verpasse kein Pampers Cash!" };
          } else if (lang === "es") {
            result[lang][messageKey] = { title: "Aún hay tiempo para recomendar amigos", body: "Todavía puedes ganar recompensas invitando amigos a Pampers Club. ¡No te pierdas Pampers Cash!" };
          } else if (lang === "fr") {
            result[lang][messageKey] = { title: "Encore le temps de recommander des amis", body: "Vous pouvez toujours gagner des récompenses en invitant des amis à Pampers Club. Ne manquez pas Pampers Cash !" };
          } else {
            result[lang][messageKey] = { title: "Still time to refer friends", body: "You can still earn rewards by inviting friends to Pampers Club. Don't miss out on Pampers Cash!" };
          }
        } else if (messageKey === "raf_day14_slideup") {
          if (lang === "de") {
            result[lang][messageKey] = { title: "Heute eine Freund:in empfehlen", body: "Teile Pampers Club mit Freund:innen und verdiene Belohnungen. Je mehr du empfiehlst, desto mehr verdienst du!" };
          } else if (lang === "es") {
            result[lang][messageKey] = { title: "Recomienda un amigo hoy", body: "Comparte Pampers Club con amigos y gana recompensas. ¡Cuanto más recomiendes, más ganarás!" };
          } else if (lang === "fr") {
            result[lang][messageKey] = { title: "Recommandez un ami aujourd'hui", body: "Partagez Pampers Club avec des amis et gagnez des récompenses. Plus vous recommandez, plus vous gagnez !" };
          } else {
            result[lang][messageKey] = { title: "Refer a friend today", body: "Share Pampers Club with friends and earn rewards. The more you refer, the more you earn!" };
          }
        } else if (messageKey === "raf_day14_email") {
          if (lang === "de") {
            result[lang][messageKey] = { subject: "Mehr Pampers Cash durch Empfehlungen verdienen", body: "Hallo! Du hast noch Zeit, Freund:innen zu Pampers Club einzuladen und Belohnungen zu verdienen. Wenn deine Freund:innen beitreten und zum ersten Mal scannen, erhaltet ihr beide Pampers Cash. Fang noch heute an zu teilen!" };
          } else if (lang === "es") {
            result[lang][messageKey] = { subject: "Gana más Pampers Cash recomendando amigos", body: "¡Hola! Todavía tienes tiempo para invitar amigos a Pampers Club y ganar recompensas. Cuando tus amigos se unan y escaneen su primer paquete, ambos obtendrán Pampers Cash. ¡Comienza a compartir hoy!" };
          } else if (lang === "fr") {
            result[lang][messageKey] = { subject: "Gagnez plus de Pampers Cash en recommandant des amis", body: "Bonjour ! Vous avez encore le temps d'inviter des amis à Pampers Club et de gagner des récompenses. Quand vos amis rejoignent et scannent leur premier paquet, vous obtenez tous les deux Pampers Cash. Commencez à partager aujourd'hui !" };
          } else {
            result[lang][messageKey] = { subject: "Earn more Pampers Cash by referring friends", body: "Hi there! You still have time to invite friends to Pampers Club and earn rewards. When your friends join and scan their first pack, you both get Pampers Cash. Start sharing today!" };
          }
        } else if (messageKey === "raf_day30_push") {
          if (lang === "de") {
            result[lang][messageKey] = { title: "Letzte Chance, Freund:innen zu empfehlen", body: "Dies ist deine letzte Gelegenheit, Pampers Cash durch Empfehlungen zu verdienen. Lade jetzt Freund:innen zu Pampers Club ein!" };
          } else if (lang === "es") {
            result[lang][messageKey] = { title: "Última oportunidad para recomendar amigos", body: "Esta es tu última oportunidad de ganar Pampers Cash mediante recomendaciones. ¡Invita amigos a Pampers Club ahora!" };
          } else if (lang === "fr") {
            result[lang][messageKey] = { title: "Dernière chance de recommander des amis", body: "C'est votre dernière opportunité de gagner Pampers Cash grâce aux recommandations. Invitez des amis à Pampers Club maintenant !" };
          } else {
            result[lang][messageKey] = { title: "Last chance to refer friends", body: "This is your final opportunity to earn Pampers Cash through referrals. Invite friends to Pampers Club now!" };
          }
        } else if (messageKey === "raf_day30_slideup") {
          if (lang === "de") {
            result[lang][messageKey] = { title: "Letzte Empfehlungsmöglichkeit", body: "Verpasse nicht deine letzte Chance, Belohnungen zu verdienen. Empfehle Freund:innen Pampers Club und erhalte Pampers Cash!" };
          } else if (lang === "es") {
            result[lang][messageKey] = { title: "Última oportunidad de recomendación", body: "No pierdas tu última oportunidad de ganar recompensas. ¡Recomienda Pampers Club a amigos y obtén Pampers Cash!" };
          } else if (lang === "fr") {
            result[lang][messageKey] = { title: "Dernière opportunité de recommandation", body: "Ne manquez pas votre dernière chance de gagner des récompenses. Recommandez Pampers Club à des amis et obtenez Pampers Cash !" };
          } else {
            result[lang][messageKey] = { title: "Final referral opportunity", body: "Don't miss your last chance to earn rewards. Refer friends to Pampers Club and get Pampers Cash!" };
          }
        } else if (messageKey === "raf_day30_inbox") {
          if (lang === "de") {
            result[lang][messageKey] = { title: "Eine letzte Empfehlungserinnerung", body: "Dies ist deine letzte Chance, Pampers Cash durch Empfehlungen zu verdienen. Teile Pampers Club noch heute mit deinem Netzwerk!" };
          } else if (lang === "es") {
            result[lang][messageKey] = { title: "Un último recordatorio de recomendación", body: "Esta es tu última oportunidad de ganar Pampers Cash mediante recomendaciones. ¡Comparte Pampers Club con tu red hoy!" };
          } else if (lang === "fr") {
            result[lang][messageKey] = { title: "Un dernier rappel de recommandation", body: "C'est votre dernière chance de gagner Pampers Cash grâce aux recommandations. Partagez Pampers Club avec votre réseau aujourd'hui !" };
          } else {
            result[lang][messageKey] = { title: "One last referral reminder", body: "This is your final chance to earn Pampers Cash by referring friends. Share Pampers Club with your network today!" };
          }
        } else {
          // Fallback for other RAF keys - use theme-appropriate messages
          if (isNewYear) {
            if (lang === "de") {
              result[lang][messageKey] = { title: "Frohes Neues Jahr mit Pampers Cash", body: "Starte das neue Jahr mit Belohnungen von Pampers Club!" };
            } else if (lang === "es") {
              result[lang][messageKey] = { title: "¡Feliz Año Nuevo con Pampers Cash!", body: "¡Comienza el año nuevo con recompensas de Pampers Club!" };
            } else if (lang === "fr") {
              result[lang][messageKey] = { title: "Bonne année avec Pampers Cash", body: "Commencez la nouvelle année avec des récompenses de Pampers Club !" };
            } else {
              result[lang][messageKey] = { title: "Happy New Year with Pampers Cash", body: "Start the new year with rewards from Pampers Club!" };
            }
          } else if (isXmas) {
            if (lang === "de") {
              result[lang][messageKey] = { title: "Frohe Weihnachten mit Pampers Cash", body: "Feiere Weihnachten mit Belohnungen von Pampers Club!" };
            } else if (lang === "es") {
              result[lang][messageKey] = { title: "¡Feliz Navidad con Pampers Cash!", body: "¡Celebra Navidad con recompensas de Pampers Club!" };
            } else if (lang === "fr") {
              result[lang][messageKey] = { title: "Joyeux Noël avec Pampers Cash", body: "Célébrez Noël avec des récompenses de Pampers Club !" };
            } else {
              result[lang][messageKey] = { title: "Merry Christmas with Pampers Cash", body: "Celebrate Christmas with rewards from Pampers Club!" };
            }
          } else {
            if (lang === "de") {
              result[lang][messageKey] = { title: "Pampers Club Belohnung", body: "Verdiene Pampers Cash mit Pampers Club!" };
            } else if (lang === "es") {
              result[lang][messageKey] = { title: "Recompensa Pampers Club", body: "¡Gana Pampers Cash con Pampers Club!" };
            } else if (lang === "fr") {
              result[lang][messageKey] = { title: "Récompense Pampers Club", body: "Gagnez Pampers Cash avec Pampers Club !" };
            } else {
              result[lang][messageKey] = { title: "Pampers Club Reward", body: "Earn Pampers Cash with Pampers Club!" };
            }
          }
        }
      } else {
        // Generic/non-RAF messages
        if (messageKey === "generic_day1_push") {
          if (lang === "de") {
            result[lang][messageKey] = { title: "Willkommen bei Pampers Club", body: "Danke fürs Beitreten! Bleib dran für Updates und Sonderangebote." };
          } else if (lang === "es") {
            result[lang][messageKey] = { title: "Bienvenido a Pampers Club", body: "¡Gracias por unirte! Mantente atento a actualizaciones y ofertas especiales." };
          } else if (lang === "fr") {
            result[lang][messageKey] = { title: "Bienvenue dans Pampers Club", body: "Merci de nous rejoindre ! Restez à l'écoute pour les mises à jour et les offres spéciales." };
          } else {
            result[lang][messageKey] = { title: "Welcome to Pampers Club", body: "Thanks for joining! Stay tuned for updates and special offers." };
          }
        } else {
          // Fallback for other generic keys
          if (lang === "de") {
            result[lang][messageKey] = { title: "Pampers Club", body: "Willkommen bei Pampers Club!" };
          } else if (lang === "es") {
            result[lang][messageKey] = { title: "Pampers Club", body: "¡Bienvenido a Pampers Club!" };
          } else if (lang === "fr") {
            result[lang][messageKey] = { title: "Pampers Club", body: "Bienvenue dans Pampers Club !" };
          } else {
            result[lang][messageKey] = { title: "Pampers Club", body: "Welcome to Pampers Club!" };
          }
        }
      }
    }
  }

  return result;
};

