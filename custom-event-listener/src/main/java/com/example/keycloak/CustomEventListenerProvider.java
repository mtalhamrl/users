package com.example.keycloak;

import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

public class CustomEventListenerProvider implements EventListenerProvider {

    private final KeycloakSession session;

    public CustomEventListenerProvider(KeycloakSession session) {
        this.session = session;
    }

    @Override
    public void onEvent(Event event) {
        if (event.getType().equals(Event.Type.REGISTER)) {
            RealmModel realm = session.realms().getRealm(event.getRealmId());
            UserModel user = session.users().getUserById(realm, event.getUserId());

            // Kullanıcı bilgilerini al
            String referenceId = user.getId();
            String username = user.getUsername();
            String firstName = user.getFirstName();
            String lastName = user.getLastName();
            String email = user.getEmail();

            // Bu bilgileri NestJS endpoint'ine gönder
            sendUserToNestJS(referenceId, username, firstName, lastName, email);
        }
    }

    private void sendUserToNestJS(String referenceId, String username, String firstName, String lastName, String email) {
        // HTTP isteği yaparak kullanıcı bilgilerini NestJS'e gönderin
        // Burada HTTP client kütüphanesini kullanabilirsiniz, örneğin Apache HttpClient veya OkHttp
    }

    @Override
    public void close() {}

    @Override
    public void onEvent(org.keycloak.events.admin.AdminEvent event, boolean includeRepresentation) {
        // AdminEvent işlemleri için gereksizse, bu metodu boş bırakabilirsiniz.
    }
}
