import socket
from kivy.app import App
from kivy.lang import Builder
from kivy.uix.screenmanager import Screen
from kivy.uix.popup import Popup
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.clock import Clock
from sys import exit

HOST = "127.0.0.1" 
PORT = 54321

def send_to_server(command):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        s.sendall(command.encode())
        return s.recv(1024).decode()

# Fenêtres de l'application
class LoginScreen(Screen):
    def login(self, username, password):
        data = send_to_server('LOGIN'+'|'+str(username)+'|'+str(password))
        if data == "True":
            App.get_running_app().username = username
            self.manager.current = "main"
        else:
            self.show_error("Identifiants incorrects")

    def register(self, username, password):
        data = send_to_server('REGISTER'+'|'+str(username)+'|'+str(password))
        if data == "True":
            App.get_running_app().username = username
            self.manager.current = "main"
        else:
            self.show_error("Nom déjà pris")

    def show_error(self, message):
        popup = Popup(title="Erreur", content=Label(text=message), size_hint=(0.8, 0.4))
        popup.open()

    def retour (self):
        exit()

class MainScreen(Screen):
    def on_pre_enter(self):
        self.ids.discussion_list.clear_widgets()
        username = App.get_running_app().username
        discussions = send_to_server('GET_DISCUSSIONS'+'|'+str(username))
        if discussions != 'False':
            discussions = discussions.rstrip('|')
            discussions = discussions.split('|')
            disc = [(disc_id, nom) for disc_id, nom in (pair.split(':') for pair in discussions)]
            for disc_id, nom in disc:
                btn = Button(text=nom, size_hint_y=None, height=40)
                btn.bind(on_release=lambda instance, disc_id=disc_id: self.open_discussion(disc_id))
                self.ids.discussion_list.add_widget(btn)
        else:
            return

    def create_discussion(self):
        self.manager.current = "create_discussion"

    def open_discussion(self, discussion_id):
        App.get_running_app().current_discussion = discussion_id
        self.manager.current = "chat"
    
    def retour (self):
        self.manager.current = "login"

class CreateDiscussionScreen(Screen):
    members = []

    def add_member(self, username):
        data = send_to_server('EXIST'+'|'+str(username))
        if data == "True":
            self.members.append(username)
            self.ids.members_list.text += f"{username}\n"
        else:
            self.show_error("Nom d'utilisateur inconnu")

    def create(self,nom):
        if not self.members:
            self.show_error("Ajoutez au moins un membre")
            return
        username = App.get_running_app().username
        members_str = ",".join(self.members + [username])
        send_to_server('CREATE_DISCUSSION'+'|'+str(members_str)+'|'+str(nom))
        self.manager.current = "main"

    def show_error(self, message):
        popup = Popup(title="Erreur", content=Label(text=message), size_hint=(0.8, 0.4))
        popup.open()

    def retour (self):
        self.manager.current = "main"

class ChatScreen(Screen):
    def on_pre_enter(self):
        # Initialiser le chat avec les messages existants
        self.ids.chat_log.text = ""
        self.load_messages()

        # Lancer l'actualisation toutes les 2 secondes
        self.event = Clock.schedule_interval(self.refresh_messages, 2)

    def on_leave(self):
        # Arrêter l'actualisation lorsqu'on quitte la discussion
        Clock.unschedule(self.event)

    def load_messages(self):
        # Charger les messages existants
        discussion_id = App.get_running_app().current_discussion
        messages = send_to_server('GET_MESSAGES'+'|'+str(discussion_id))
        if messages == 'False':
            return
        else:
            messages = messages.rstrip('|')
            messages = messages.split('|')
            disc = [(sender, msg, time) for sender, msg, time in (pair.split(';') for pair in messages)]
            for sender, msg, time in disc:
                self.ids.chat_log.text += f"[{time}] {sender}: {msg}\n"

    def refresh_messages(self, dt):
        # Vérifier s'il y a de nouveaux messages
        discussion_id = App.get_running_app().current_discussion
        messages = send_to_server('GET_MESSAGES'+'|'+str(discussion_id))
        if messages == 'False':
            return
        else:
            # Afficher les messages s'ils ne sont pas déjà affichés
            current_chat = self.ids.chat_log.text
            new_chat = ""
            messages = messages.rstrip('|')
            messages = messages.split('|')
            disc = [(sender, msg, time) for sender, msg, time in (pair.split(';') for pair in messages)]
            for sender, msg, time in disc:
                new_chat += f"[{time}] {sender}: {msg}\n"
            self.ids.chat_log.text = new_chat
            if new_chat != current_chat:
                self.ids.chat_log.text = new_chat
    
    def send_message(self, text):
        if not text.strip():
            return
        discussion = App.get_running_app().current_discussion
        username = App.get_running_app().username
        timestamp = send_to_server('SEND_MESSAGE'+'|'+str(discussion)+'|'+str(username)+'|'+str(text))    
        # Mettre à jour l'affichage du chat
        self.ids.chat_log.text += f"[{timestamp}] {username}: {text}\n"
        self.ids.message_input.text = ""
    
    def retour (self):
        self.on_leave()
        self.manager.current = "main"

class ChatApp(App):
    username = None
    current_discussion = None

    def build(self):
        return Builder.load_file("layout.kv")

if __name__ == "__main__":
    ChatApp().run()