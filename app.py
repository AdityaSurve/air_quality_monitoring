import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

# Read the CSV data
csv_file = "./data/aqi_data.csv"


@st.cache_data(ttl=60)
def load_data():
    return pd.read_csv(csv_file, parse_dates=['Timestamp'])

# Auto-refresh every 60 seconds


def auto_refresh():
    st.experimental_rerun()


st.set_page_config(
    page_title="Live AQI Data",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        'Get Help': 'https://www.extremelycoolapp.com/help',
        'Report a bug': "https://www.extremelycoolapp.com/bug",
        'About': "# This is a header. This is an *extremely* cool app!"
    }
)

data = load_data()

st.title('Air Quality Index Over Time')

if data.empty:
    st.write("No data available.")
else:
    grouped_data = data.groupby('ParameterName')
    for group, df in grouped_data:
        fig, ax = plt.subplots()
        df.plot(x='Timestamp', y='AQI', ax=ax, title=group)
        ax.set_xlabel('Timestamp')
        ax.set_ylabel('AQI')
        st.pyplot(fig)

st.button("Refresh", on_click=auto_refresh)

st.markdown(
    """
    <script>
    function refreshAt(hours, minutes, seconds) {
        var now = new Date();
        var then = new Date();

        if (now.getHours() > hours ||
            (now.getHours() == hours && now.getMinutes() > minutes) ||
            (now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds)) {
            then.setDate(now.getDate() + 1);
        }
        then.setHours(hours);
        then.setMinutes(minutes);
        then.setSeconds(seconds);

        var timeout = (then.getTime() - now.getTime());
        setTimeout(function(){ window.location.reload(true); }, timeout);
    }

    setInterval(function() {
        window.location.reload();
    }, 60000); // Refresh every 60 seconds
    </script>
    """,
    unsafe_allow_html=True
)
